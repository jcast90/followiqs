/**
 * VOS-816 — Sandbox-side HMAC tunnel-token verifier.
 *
 * The dashboard mints `?token=<base64url(HMAC_SHA256(SANDBOX_TUNNEL_SECRET,
 * <venture_id>:<fund_id>:<expiry_unix_ts>))>&expires=<expiry_unix_ts>` and
 * embeds it as the iframe src for the live preview sandbox. This module
 * runs on the sandbox side (inside `proxy.ts`) and rejects any request
 * that doesn't carry a valid token.
 *
 * Token payload: `<venture_id>:<fund_id>:<expiry>` — the venture and fund
 * IDs are read from env (`VENTURE_ID`, `FUND_ID`) injected at sandbox
 * spawn time. The expiry comes from the URL. The secret comes from env
 * (`SANDBOX_TUNNEL_SECRET`).
 *
 * Cookie: on successful verification we set a signed `vos_tunnel` cookie
 * so subsequent requests (HMR websocket reconnects, image fetches,
 * navigation within the iframe) don't need to re-present the URL token.
 * The cookie format is `<expiry>.<base64url(HMAC_SHA256(secret, "cookie:"
 * + venture_id + ":" + fund_id + ":" + expiry))>`. The `cookie:` prefix
 * domain-separates the cookie HMAC from the URL token HMAC so a stolen
 * cookie can't be replayed as a URL token (defense in depth).
 *
 * When `SANDBOX_TUNNEL_SECRET` is unset the verifier is disabled and
 * every request passes — preserves existing sandbox behavior on
 * deploys that haven't injected the secret yet (e.g. VOS-818 follow-up
 * for env injection in spawn). Once the secret is set, enforcement is
 * mandatory.
 */

const COOKIE_NAME = "vos_tunnel";
const COOKIE_PAYLOAD_PREFIX = "cookie:"; // domain separation from URL HMAC

export interface VerifyResult {
  /** True if the request is authenticated. False if a token was required
   *  and missing/invalid. */
  ok: boolean;
  /** Why we rejected. Useful for 403 response bodies + observability. */
  reason?: string;
  /** When `ok=true`, the unix-second expiry the caller should use to
   *  set the response cookie. */
  expiresAt?: number;
  /** When `ok=true`, the cookie value the caller should set on the
   *  response so subsequent requests skip URL re-verification. */
  cookieValue?: string;
}

/** True iff the verifier is configured and should enforce on every
 *  request. When this returns false the proxy should let everything
 *  through unchanged (back-compat for un-provisioned sandboxes). */
export function isTunnelAuthEnabled(): boolean {
  return Boolean(process.env.SANDBOX_TUNNEL_SECRET);
}

/** Validate a request's tunnel auth.
 *
 *  Order of checks:
 *    1. SANDBOX_TUNNEL_SECRET unset → auth disabled, allow.
 *    2. Valid `vos_tunnel` cookie → allow.
 *    3. Valid `?token=&expires=` query string → allow + return cookie
 *       to set on the response.
 *    4. Otherwise → reject.
 */
export async function verifyTunnelRequest(args: {
  searchParams: URLSearchParams;
  cookieHeader: string | null;
  /** Override for tests — defaults to Date.now()/1000. */
  now?: number;
}): Promise<VerifyResult> {
  const secret = process.env.SANDBOX_TUNNEL_SECRET;
  if (!secret) {
    return { ok: true, reason: "auth_disabled" };
  }
  const ventureId = process.env.VENTURE_ID;
  const fundId = process.env.FUND_ID;
  if (!ventureId || !fundId) {
    // Secret is set but identity envs aren't — fail closed. A misconfigured
    // sandbox is preferable to one that silently lets anyone in.
    return { ok: false, reason: "venture_or_fund_env_missing" };
  }
  const now = args.now ?? Math.floor(Date.now() / 1000);

  // 2. Cookie path — lets HMR + same-origin nav skip URL re-verification.
  const cookieValueIn = readCookie(args.cookieHeader, COOKIE_NAME);
  if (cookieValueIn) {
    const result = await verifyCookie({
      cookieValue: cookieValueIn,
      ventureId,
      fundId,
      secret,
      now,
    });
    if (result.ok) return result;
    // Bad cookie shouldn't poison subsequent requests — fall through to
    // URL verification rather than reject outright. The fallthrough path
    // also handles cookie expiry: the user's iframe re-mints a fresh
    // token on every status flip into 'running', so a fresh URL token
    // will be present even after a long idle.
  }

  // 3. URL path — first request after token mint or cookie expiry.
  const token = args.searchParams.get("token");
  const expiresStr = args.searchParams.get("expires");
  if (!token || !expiresStr) {
    return { ok: false, reason: "no_token" };
  }
  const expiresAt = Number(expiresStr);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    return { ok: false, reason: "expired" };
  }

  const payload = `${ventureId}:${fundId}:${expiresAt}`;
  const expected = await hmacSha256(secret, payload);
  if (!constantTimeEqual(expected, token)) {
    return { ok: false, reason: "bad_signature" };
  }

  // Mint the cookie so future requests in the same session skip the URL
  // check. Domain-separated HMAC payload prevents token<->cookie replay.
  const cookieSig = await hmacSha256(
    secret,
    `${COOKIE_PAYLOAD_PREFIX}${ventureId}:${fundId}:${expiresAt}`,
  );
  return {
    ok: true,
    expiresAt,
    cookieValue: `${expiresAt}.${cookieSig}`,
  };
}

/** Build the Set-Cookie header value for a successful verification.
 *  Caller pulls `cookieValue` + `expiresAt` out of VerifyResult. */
export function buildCookieHeader(cookieValue: string, expiresAt: number): string {
  // Same-site Lax so the cookie still travels on the iframe's initial
  // GET from the dashboard origin. HttpOnly so the iframe's JS can't
  // read it (defense vs. XSS in the venture app — though the cookie
  // alone is useless without the secret). Secure because the e2b
  // tunnel is always HTTPS. Max-Age aligns with the token expiry.
  const maxAgeSec = Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
  return [
    `${COOKIE_NAME}=${cookieValue}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ].join("; ");
}

// ---------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------

async function verifyCookie(args: {
  cookieValue: string;
  ventureId: string;
  fundId: string;
  secret: string;
  now: number;
}): Promise<VerifyResult> {
  const dotIdx = args.cookieValue.indexOf(".");
  if (dotIdx <= 0) return { ok: false, reason: "cookie_malformed" };
  const expiresStr = args.cookieValue.slice(0, dotIdx);
  const sig = args.cookieValue.slice(dotIdx + 1);
  const expiresAt = Number(expiresStr);
  if (!Number.isFinite(expiresAt) || expiresAt <= args.now) {
    return { ok: false, reason: "cookie_expired" };
  }
  const expected = await hmacSha256(
    args.secret,
    `${COOKIE_PAYLOAD_PREFIX}${args.ventureId}:${args.fundId}:${expiresAt}`,
  );
  if (!constantTimeEqual(expected, sig)) {
    return { ok: false, reason: "cookie_bad_signature" };
  }
  return { ok: true, expiresAt };
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  // Cookie header is `name1=v1; name2=v2; ...`. We don't use a full
  // RFC 6265 parser — these are server-set values whose shape we
  // control, and Next.js gives us `request.cookies.get(name)` in the
  // proxy. We accept the raw header here for unit-testability.
  for (const piece of header.split(";")) {
    const eq = piece.indexOf("=");
    if (eq < 0) continue;
    const k = piece.slice(0, eq).trim();
    if (k === name) return piece.slice(eq + 1).trim();
  }
  return null;
}

async function hmacSha256(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return base64url(new Uint8Array(sig));
}

function base64url(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

/** Constant-time string comparison to defeat timing side-channel attacks
 *  on the HMAC. Both inputs must be the same character-set; we operate
 *  on UTF-16 code units which is safe for base64url ASCII. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let acc = 0;
  for (let i = 0; i < a.length; i++) {
    acc |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return acc === 0;
}
