/**
 * VOS-816 — unit tests for src/lib/tunnel-token.ts
 *
 * Run via:  npx tsx scripts/test-tunnel-token.ts
 *
 * No test framework dep added; uses Node's built-in `node:test`. The
 * tests exercise the verifier round-trip (mint side mirrored locally),
 * cookie verification, expiry, signature mismatch, and the
 * fail-closed-when-secret-set-but-identity-missing path.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

// We have to set env BEFORE importing the module because module-level
// reads of process.env happen at import in some bundlers; here it's
// read inside `isTunnelAuthEnabled` and `verifyTunnelRequest` so we can
// set/unset between tests.
const SECRET = "test-secret-do-not-use-in-prod-0123456789abcdef";
const VENTURE = "venture_abc";
const FUND = "fund_xyz";

process.env.SANDBOX_TUNNEL_SECRET = SECRET;
process.env.VENTURE_ID = VENTURE;
process.env.FUND_ID = FUND;

import * as tunnelToken from "../src/lib/tunnel-token.js";

// Helper that mirrors the dashboard's `mintTunnelToken` so we don't have
// to depend on the venture-os repo. Must produce identical bytes.
async function mint(opts: {
  ventureId?: string;
  fundId?: string;
  expiresAt: number;
  secret?: string;
}): Promise<string> {
  const venture = opts.ventureId ?? VENTURE;
  const fund = opts.fundId ?? FUND;
  const secret = opts.secret ?? SECRET;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`${venture}:${fund}:${opts.expiresAt}`),
  );
  return base64url(new Uint8Array(sig));
}

function base64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return Buffer.from(s, "binary")
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

const NOW = 1_700_000_000;

test("verifyTunnelRequest accepts a fresh URL token + emits a cookie", async () => {
  const expiresAt = NOW + 3600;
  const token = await mint({ expiresAt });
  const params = new URLSearchParams({ token, expires: String(expiresAt) });

  const result = await tunnelToken.verifyTunnelRequest({
    searchParams: params,
    cookieHeader: null,
    now: NOW,
  });
  assert.equal(result.ok, true);
  assert.equal(result.expiresAt, expiresAt);
  assert.ok(result.cookieValue && result.cookieValue.includes("."));
});

test("verifyTunnelRequest rejects expired token", async () => {
  const expiresAt = NOW - 1;
  const token = await mint({ expiresAt });
  const params = new URLSearchParams({ token, expires: String(expiresAt) });

  const result = await tunnelToken.verifyTunnelRequest({
    searchParams: params,
    cookieHeader: null,
    now: NOW,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "expired");
});

test("verifyTunnelRequest rejects bad signature", async () => {
  const expiresAt = NOW + 3600;
  // Mint with a different secret so the HMAC won't match.
  const token = await mint({ expiresAt, secret: "wrong-secret" });
  const params = new URLSearchParams({ token, expires: String(expiresAt) });

  const result = await tunnelToken.verifyTunnelRequest({
    searchParams: params,
    cookieHeader: null,
    now: NOW,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "bad_signature");
});

test("verifyTunnelRequest rejects missing token", async () => {
  const result = await tunnelToken.verifyTunnelRequest({
    searchParams: new URLSearchParams(),
    cookieHeader: null,
    now: NOW,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "no_token");
});

test("verifyTunnelRequest rejects token bound to a different venture_id", async () => {
  const expiresAt = NOW + 3600;
  const token = await mint({ expiresAt, ventureId: "venture_other" });
  const params = new URLSearchParams({ token, expires: String(expiresAt) });

  const result = await tunnelToken.verifyTunnelRequest({
    searchParams: params,
    cookieHeader: null,
    now: NOW,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "bad_signature");
});

test("verifyTunnelRequest rejects token bound to a different fund_id", async () => {
  // Cross-fund replay defense — even if an attacker steals a valid token
  // from one fund, the HMAC payload binds it to that fund. The same
  // token must not authenticate against a sandbox running for a
  // different fund.
  const expiresAt = NOW + 3600;
  const token = await mint({ expiresAt, fundId: "fund_other" });
  const params = new URLSearchParams({ token, expires: String(expiresAt) });

  const result = await tunnelToken.verifyTunnelRequest({
    searchParams: params,
    cookieHeader: null,
    now: NOW,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "bad_signature");
});

test("verifyTunnelRequest rejects token claimed for a different expiry", async () => {
  // The mint signs HMAC over `<venture>:<fund>:<expiry>`. If an attacker
  // grabs a valid (token, expires) pair and tries to extend the expiry
  // by replacing only the URL `expires` param, the signature must fail
  // because the payload differs. This is implicit from the HMAC
  // binding but worth a regression test.
  const expiresAt = NOW + 3600;
  const token = await mint({ expiresAt });
  const tamperedExpires = expiresAt + 86_400;
  const params = new URLSearchParams({
    token,
    expires: String(tamperedExpires),
  });

  const result = await tunnelToken.verifyTunnelRequest({
    searchParams: params,
    cookieHeader: null,
    now: NOW,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "bad_signature");
});

test("verifyTunnelRequest accepts a valid cookie even without URL token", async () => {
  // First mint cookie via successful URL verification, then re-verify
  // with only the cookie present.
  const expiresAt = NOW + 3600;
  const token = await mint({ expiresAt });
  const first = await tunnelToken.verifyTunnelRequest({
    searchParams: new URLSearchParams({ token, expires: String(expiresAt) }),
    cookieHeader: null,
    now: NOW,
  });
  assert.equal(first.ok, true);
  assert.ok(first.cookieValue);

  const second = await tunnelToken.verifyTunnelRequest({
    searchParams: new URLSearchParams(),
    cookieHeader: `vos_tunnel=${first.cookieValue}`,
    now: NOW,
  });
  assert.equal(second.ok, true);
});

test("verifyTunnelRequest rejects expired cookie", async () => {
  const expiresAt = NOW + 100;
  const token = await mint({ expiresAt });
  const minted = await tunnelToken.verifyTunnelRequest({
    searchParams: new URLSearchParams({ token, expires: String(expiresAt) }),
    cookieHeader: null,
    now: NOW,
  });
  assert.equal(minted.ok, true);

  // Move clock past expiry. With no URL token to fall through to, we
  // should reject — `cookie_expired` first, then `no_token` from the
  // URL path. Either is acceptable for the user; we assert the shape.
  const result = await tunnelToken.verifyTunnelRequest({
    searchParams: new URLSearchParams(),
    cookieHeader: `vos_tunnel=${minted.cookieValue}`,
    now: NOW + 200,
  });
  assert.equal(result.ok, false);
  assert.match(result.reason ?? "", /no_token|cookie_expired/);
});

test("verifyTunnelRequest rejects tampered cookie HMAC", async () => {
  const expiresAt = NOW + 3600;
  const token = await mint({ expiresAt });
  const minted = await tunnelToken.verifyTunnelRequest({
    searchParams: new URLSearchParams({ token, expires: String(expiresAt) }),
    cookieHeader: null,
    now: NOW,
  });
  assert.ok(minted.cookieValue);

  // Tamper with the signature portion (after the `.`).
  const [exp, sig] = minted.cookieValue!.split(".");
  const tampered = `${exp}.${sig.slice(0, -1)}A`; // change last char
  const result = await tunnelToken.verifyTunnelRequest({
    searchParams: new URLSearchParams(),
    cookieHeader: `vos_tunnel=${tampered}`,
    now: NOW,
  });
  assert.equal(result.ok, false);
});

test("URL token cannot be replayed as a cookie value (domain separation)", async () => {
  // The URL HMAC and cookie HMAC use different payload prefixes. A token
  // valid for the URL must not validate as a cookie even if the user
  // pastes it in.
  const expiresAt = NOW + 3600;
  const token = await mint({ expiresAt });
  const fakeCookie = `${expiresAt}.${token}`;
  const result = await tunnelToken.verifyTunnelRequest({
    searchParams: new URLSearchParams(),
    cookieHeader: `vos_tunnel=${fakeCookie}`,
    now: NOW,
  });
  assert.equal(result.ok, false);
});

test("isTunnelAuthEnabled is false when secret is missing", async () => {
  const prev = process.env.SANDBOX_TUNNEL_SECRET;
  delete process.env.SANDBOX_TUNNEL_SECRET;
  try {
    assert.equal(tunnelToken.isTunnelAuthEnabled(), false);
    // And verify becomes a pass-through.
    const result = await tunnelToken.verifyTunnelRequest({
      searchParams: new URLSearchParams(),
      cookieHeader: null,
      now: NOW,
    });
    assert.equal(result.ok, true);
    assert.equal(result.reason, "auth_disabled");
  } finally {
    if (prev !== undefined) process.env.SANDBOX_TUNNEL_SECRET = prev;
  }
});

test("isTunnelAuthEnabled is false when secret is empty string", async () => {
  // Common deploy mistake: env var is wired but the value is "". Boolean("")
  // is false, so we treat empty same as unset (auth disabled). Documented
  // behavior; assert it so a future refactor can't accidentally flip it.
  const prev = process.env.SANDBOX_TUNNEL_SECRET;
  process.env.SANDBOX_TUNNEL_SECRET = "";
  try {
    assert.equal(tunnelToken.isTunnelAuthEnabled(), false);
    const result = await tunnelToken.verifyTunnelRequest({
      searchParams: new URLSearchParams(),
      cookieHeader: null,
      now: NOW,
    });
    assert.equal(result.ok, true);
    assert.equal(result.reason, "auth_disabled");
  } finally {
    if (prev !== undefined) process.env.SANDBOX_TUNNEL_SECRET = prev;
  }
});

test("verifyTunnelRequest fails closed when VENTURE_ID/FUND_ID missing", async () => {
  // Common misconfig: secret got injected but the lifecycle spawn
  // forgot to inject identity. Anything getting through here would
  // mean a sandbox was open to the world.
  const prev = { v: process.env.VENTURE_ID, f: process.env.FUND_ID };
  delete process.env.VENTURE_ID;
  delete process.env.FUND_ID;
  try {
    const result = await tunnelToken.verifyTunnelRequest({
      searchParams: new URLSearchParams({ token: "x", expires: String(NOW + 1) }),
      cookieHeader: null,
      now: NOW,
    });
    assert.equal(result.ok, false);
    assert.equal(result.reason, "venture_or_fund_env_missing");
  } finally {
    if (prev.v !== undefined) process.env.VENTURE_ID = prev.v;
    if (prev.f !== undefined) process.env.FUND_ID = prev.f;
  }
});

test("buildCookieHeader emits required attributes", () => {
  const header = tunnelToken.buildCookieHeader("abc.def", NOW + 3600);
  assert.match(header, /^vos_tunnel=abc\.def/);
  assert.match(header, /HttpOnly/);
  assert.match(header, /Secure/);
  assert.match(header, /SameSite=Lax/);
  assert.match(header, /Path=\//);
});
