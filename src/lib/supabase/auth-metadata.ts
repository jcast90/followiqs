/**
 * Auth user_metadata helpers.
 *
 * The shared send-email hook (venture-os auth-bridge) resolves which venture
 * an auth email belongs to by reading `user.user_metadata.venture_slug`.
 * Every Supabase auth call that creates or touches a user must pass this
 * through `options.data` so the slug lands in user_metadata.
 */

export function ventureSlug(): string {
  return process.env.NEXT_PUBLIC_VENTURE_SLUG || "";
}

/**
 * Use as: `supabase.auth.signInWithOtp({ email, options: { ...authOptions() } })`.
 * Returns `{ shouldCreateUser, data: { venture_slug } }` so existing defaults
 * stay consistent and the slug is always stamped on new users.
 */
export function authOptions(extra?: Record<string, unknown>): {
  shouldCreateUser: boolean;
  data: Record<string, unknown>;
} {
  const slug = ventureSlug();
  const data: Record<string, unknown> = { ...(extra || {}) };
  if (slug) data.venture_slug = slug;
  return { shouldCreateUser: true, data };
}
