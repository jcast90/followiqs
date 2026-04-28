-- Stripe billing columns for followiqs_profiles (VOS-206 scaffold).
-- Idempotent: each ADD COLUMN guarded by IF NOT EXISTS.
ALTER TABLE followiqs_profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE followiqs_profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE followiqs_profiles ADD COLUMN IF NOT EXISTS stripe_price_id text;
ALTER TABLE followiqs_profiles ADD COLUMN IF NOT EXISTS stripe_status text;
CREATE INDEX IF NOT EXISTS followiqs_profiles_stripe_customer_id_idx
  ON followiqs_profiles (stripe_customer_id);
