/**
 * Admin session tokens.
 *
 * THE DEFECT THIS REPLACES
 *
 * The login route set `haven-admin-auth = "authenticated"` — a constant string —
 * and both proxy.ts and /admin checked for exactly that value. `httpOnly` stops
 * JavaScript from *reading* the cookie, but it does nothing to stop a person
 * from *writing* one: open devtools → Application → Cookies → add
 * `haven-admin-auth=authenticated` and you are an administrator. The password
 * was decoration.
 *
 * WHY A SIGNED TOKEN FIXES IT
 *
 * The cookie now carries `expiry.signature`, where the signature is an
 * HMAC-SHA256 of the expiry computed with a server-only secret. An attacker can
 * still write any cookie they like, but they cannot produce a signature that
 * verifies without the secret — and the secret never leaves the server. This is
 * the same principle behind every session cookie and JWT: the client may hold
 * the token, but only the server can mint one.
 *
 * The expiry is inside the signed payload rather than relying on the cookie's
 * own Max-Age, because Max-Age is enforced by the browser (which the attacker
 * controls) whereas a signed expiry is enforced by us.
 *
 * Web Crypto rather than node:crypto: Next 16 runs proxy.ts on the Node runtime
 * today, but Web Crypto works in both Node and edge, so this keeps the door
 * open without a rewrite.
 */

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
export const ADMIN_COOKIE = "haven-admin-auth";

function getSecret(): string {
  // Prefer a dedicated secret. Fall back to ADMIN_PASSWORD so existing
  // deployments keep working, but warn — reusing the password as the signing
  // key means rotating the password invalidates every session, and a weak
  // password becomes a weak signing key.
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret && secret.length >= 16) return secret;

  const fallback = process.env.ADMIN_PASSWORD?.trim();
  if (!fallback) {
    throw new Error(
      "Neither ADMIN_SESSION_SECRET nor ADMIN_PASSWORD is set — admin auth cannot operate.",
    );
  }
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[auth] ADMIN_SESSION_SECRET not set; falling back to ADMIN_PASSWORD. Set a dedicated 32+ char secret before production.",
    );
  }
  return fallback;
}

const encoder = new TextEncoder();

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  // base64url so the value is cookie-safe without further encoding.
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Constant-time string comparison.
 *
 * A plain `a === b` returns as soon as it finds a differing character, so the
 * time it takes leaks how many leading characters matched. Over many requests
 * that is enough to reconstruct a signature byte by byte. Comparing every
 * character regardless removes the signal. This matters for any secret
 * comparison — signatures, tokens, and the password check below.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createAdminSession(): Promise<{
  value: string;
  maxAge: number;
}> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiresAt);
  const signature = await hmac(payload);
  return {
    value: `${payload}.${signature}`,
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  };
}

/**
 * Verify a session cookie. Returns null for anything not provably ours and
 * unexpired — malformed, tampered, or timed out all fail the same way.
 */
export async function verifyAdminSession(
  value: string | undefined | null,
): Promise<{ expiresAt: number } | null> {
  if (!value) return null;

  const separator = value.lastIndexOf(".");
  if (separator <= 0) return null;

  const payload = value.slice(0, separator);
  const signature = value.slice(separator + 1);

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt)) return null;

  let expected: string;
  try {
    expected = await hmac(payload);
  } catch {
    // Missing secret — fail closed rather than granting access.
    return null;
  }

  if (!timingSafeEqual(signature, expected)) return null;

  // Check expiry AFTER verifying the signature, so an attacker cannot learn
  // anything from the difference between "expired" and "forged".
  if (Date.now() > expiresAt) return null;

  return { expiresAt };
}

/** Compare a submitted password to the configured one in constant time. */
export function passwordMatches(submitted: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof submitted !== "string") return false;
  return timingSafeEqual(submitted, expected);
}

/**
 * Very small fixed-window rate limiter for the login endpoint.
 *
 * Without this, the login route accepts unlimited guesses against a single
 * shared password — an offline-speed brute force over HTTP.
 *
 * HONEST LIMITATION: this Map lives in the memory of one server instance. On a
 * serverless platform each instance has its own, so the effective limit is
 * (attempts x instances). It raises the cost of a naive attack considerably and
 * costs nothing to run, but it is not a substitute for a shared store (Upstash,
 * Redis) or platform-level protection if this ever guards something valuable.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const entry = attempts.get(identifier);

  if (!entry || now > entry.resetAt) {
    attempts.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Clear the counter for an identifier after a successful login. */
export function resetRateLimit(identifier: string): void {
  attempts.delete(identifier);
}
