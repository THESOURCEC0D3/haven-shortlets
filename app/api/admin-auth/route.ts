import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSession,
  passwordMatches,
  checkRateLimit,
  resetRateLimit,
} from "@/lib/auth";

/** Best-effort client identifier for rate limiting behind a proxy/CDN. */
function clientId(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const id = clientId(request);

  // Rate limit BEFORE touching the password, so a blocked client learns nothing
  // about whether their guess was close.
  const limit = checkRateLimit(id);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Constant-time comparison — see lib/auth.ts for why `!==` leaks information.
  if (!passwordMatches(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  resetRateLimit(id);

  // The cookie value is now a signed, self-expiring token rather than the
  // literal string "authenticated", which anyone could type into devtools.
  const session = await createAdminSession();

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "strict" rather than "lax": there is no legitimate cross-site navigation
    // into the admin area, so there is no reason to send this cookie on one.
    // That closes the CSRF vector on the availability-toggle action.
    sameSite: "strict",
    maxAge: session.maxAge,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
