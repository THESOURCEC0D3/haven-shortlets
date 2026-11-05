import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/auth";

/**
 * Optimistic auth gate for /admin.
 *
 * The Next.js docs are explicit that Proxy (formerly Middleware) is for
 * *optimistic* checks and "should not be used as a full session management or
 * authorization solution". So this is one of three layers, not the only one:
 *
 *   1. HERE — cheap redirect so an unauthenticated visitor never sees the shell.
 *   2. app/admin/page.tsx — re-verifies before reading any data.
 *   3. lib/actions.ts — re-verifies before any mutation, because a Server
 *      Action is a public endpoint reachable without ever loading the page.
 *
 * Layer 3 is the one people forget. Removing it would leave the availability
 * toggle callable by anyone who can read the JS bundle.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = await verifyAdminSession(
      request.cookies.get(ADMIN_COOKIE)?.value,
    );

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clear the stale/forged cookie so the browser stops resending it.
      response.cookies.set(ADMIN_COOKIE, "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
