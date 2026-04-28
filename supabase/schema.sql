-- =============================================================================
-- Followiqs — Supabase PostgreSQL Schema
-- Venture: e2e-test-20260428-193315
-- Domain:  followiqs.com
-- Prefix:  followiqs_
-- =============================================================================

-- ---------------------------------------------------------------------------
-- UTILITY: updated_at trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- BASE TABLE: waitlist
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS followiqs_waitlist (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text        UNIQUE NOT NULL,
  source     text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE followiqs_waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can join waitlist" ON "followiqs_waitlist";
CREATE POLICY "Anyone can join waitlist"
  ON followiqs_waitlist FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read waitlist" ON "followiqs_waitlist";
CREATE POLICY "Anyone can read waitlist"
  ON followiqs_waitlist FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- BASE TABLE: profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS followiqs_profiles (
  id                 uuid        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name          text,
  email              text,
  avatar_url         text,
  plan               text        DEFAULT 'free',
  stripe_customer_id text,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);

ALTER TABLE followiqs_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON "followiqs_profiles";
CREATE POLICY "Users can view own profile"
  ON followiqs_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON "followiqs_profiles";
CREATE POLICY "Users can update own profile"
  ON followiqs_profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role full access to profiles" ON "followiqs_profiles";
CREATE POLICY "Service role full access to profiles"
  ON followiqs_profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP TRIGGER IF EXISTS "update_followiqs_profiles_updated_at" ON followiqs_profiles;
CREATE TRIGGER update_followiqs_profiles_updated_at
  BEFORE UPDATE ON followiqs_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- BASE TABLE: api_keys
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS followiqs_api_keys (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        REFERENCES auth.users ON DELETE CASCADE,
  name         text        NOT NULL,
  key_hash     text        NOT NULL,
  prefix       text        NOT NULL,
  last_used_at timestamptz,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE followiqs_api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own api_keys" ON "followiqs_api_keys";
CREATE POLICY "Users can view own api_keys"
  ON followiqs_api_keys FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own api_keys" ON "followiqs_api_keys";
CREATE POLICY "Users can insert own api_keys"
  ON followiqs_api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own api_keys" ON "followiqs_api_keys";
CREATE POLICY "Users can update own api_keys"
  ON followiqs_api_keys FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own api_keys" ON "followiqs_api_keys";
CREATE POLICY "Users can delete own api_keys"
  ON followiqs_api_keys FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_followiqs_api_keys_user_id
  ON followiqs_api_keys(user_id);

-- ---------------------------------------------------------------------------
-- BASE TABLE: page_views
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS followiqs_page_views (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  page       text,
  referrer   text,
  user_agent text,
  country    text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_followiqs_page_views_created_at
  ON followiqs_page_views(created_at DESC);

-- ---------------------------------------------------------------------------
-- AUTH TRIGGER: auto-create profile on signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.followiqs_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_followiqs ON auth.users;
DROP TRIGGER IF EXISTS "on_auth_user_created_followiqs" ON auth.users;
CREATE TRIGGER on_auth_user_created_followiqs
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ---------------------------------------------------------------------------
-- PRODUCT TABLE: follow_up_flows
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS followiqs_follow_up_flows (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name        text        NOT NULL,
  status      text        NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'paused', 'archived')),
  steps_count integer     NOT NULL DEFAULT 0 CHECK (steps_count >= 0),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE followiqs_follow_up_flows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own follow_up_flows" ON "followiqs_follow_up_flows";
CREATE POLICY "Users can view own follow_up_flows"
  ON followiqs_follow_up_flows FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own follow_up_flows" ON "followiqs_follow_up_flows";
CREATE POLICY "Users can insert own follow_up_flows"
  ON followiqs_follow_up_flows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own follow_up_flows" ON "followiqs_follow_up_flows";
CREATE POLICY "Users can update own follow_up_flows"
  ON followiqs_follow_up_flows FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own follow_up_flows" ON "followiqs_follow_up_flows";
CREATE POLICY "Users can delete own follow_up_flows"
  ON followiqs_follow_up_flows FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_followiqs_follow_up_flows_user_id
  ON followiqs_follow_up_flows(user_id);

CREATE INDEX IF NOT EXISTS idx_followiqs_follow_up_flows_created_at
  ON followiqs_follow_up_flows(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_followiqs_follow_up_flows_status
  ON followiqs_follow_up_flows(status);

DROP TRIGGER IF EXISTS "update_followiqs_follow_up_flows_updated_at" ON followiqs_follow_up_flows;
CREATE TRIGGER update_followiqs_follow_up_flows_updated_at
  BEFORE UPDATE ON followiqs_follow_up_flows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- PRODUCT TABLE: quotes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS followiqs_quotes (
  id             uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid           NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title          text           NOT NULL,
  customer_email text           NOT NULL,
  status         text           NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'followed-up', 'closed', 'lost')),
  amount         numeric(10, 2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0),
  flow_id uuid,
  notes          text,
  sent_at        timestamptz,
  created_at     timestamptz    DEFAULT now(),
  updated_at     timestamptz    DEFAULT now());

ALTER TABLE "followiqs_quotes" ADD CONSTRAINT "fk_followiqs_quotes_flow_id"
  FOREIGN KEY ("flow_id") REFERENCES "followiqs_follow_up_flows"("id") ON DELETE SET NULL;

ALTER TABLE followiqs_quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own quotes" ON "followiqs_quotes";
CREATE POLICY "Users can view own quotes"
  ON followiqs_quotes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quotes" ON "followiqs_quotes";
CREATE POLICY "Users can insert own quotes"
  ON followiqs_quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own quotes" ON "followiqs_quotes";
CREATE POLICY "Users can update own quotes"
  ON followiqs_quotes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own quotes" ON "followiqs_quotes";
CREATE POLICY "Users can delete own quotes"
  ON followiqs_quotes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_followiqs_quotes_user_id
  ON followiqs_quotes(user_id);

CREATE INDEX IF NOT EXISTS idx_followiqs_quotes_created_at
  ON followiqs_quotes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_followiqs_quotes_status
  ON followiqs_quotes(status);

CREATE INDEX IF NOT EXISTS idx_followiqs_quotes_customer_email
  ON followiqs_quotes(customer_email);

CREATE INDEX IF NOT EXISTS idx_followiqs_quotes_flow_id
  ON followiqs_quotes(flow_id);

DROP TRIGGER IF EXISTS "update_followiqs_quotes_updated_at" ON followiqs_quotes;
CREATE TRIGGER update_followiqs_quotes_updated_at
  BEFORE UPDATE ON followiqs_quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE IF NOT EXISTS "followiqs_waitlist" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "followiqs_api_keys" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  prefix TEXT NOT NULL,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS "followiqs_waitlist"
  ADD COLUMN IF NOT EXISTS anon_id TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'landing_page',
  ADD COLUMN IF NOT EXISTS experiment_key TEXT,
  ADD COLUMN IF NOT EXISTS variant_key TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS referrer TEXT;

CREATE TABLE IF NOT EXISTS "followiqs_page_views" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  anon_id TEXT,
  experiment_key TEXT,
  variant_key TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "followiqs_experiment_assignments" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id TEXT NOT NULL,
  experiment_key TEXT NOT NULL,
  variant_key TEXT NOT NULL,
  first_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (experiment_key, anon_id)
);

CREATE TABLE IF NOT EXISTS "followiqs_experiment_events" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  anon_id TEXT,
  email TEXT,
  experiment_key TEXT,
  variant_key TEXT,
  page TEXT,
  country TEXT,
  props JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backfill columns if tables already existed (LLM-generated) before runtime extensions ran.
ALTER TABLE IF EXISTS "followiqs_page_views"
  ADD COLUMN IF NOT EXISTS anon_id TEXT,
  ADD COLUMN IF NOT EXISTS experiment_key TEXT,
  ADD COLUMN IF NOT EXISTS variant_key TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

ALTER TABLE IF EXISTS "followiqs_experiment_assignments"
  ADD COLUMN IF NOT EXISTS anon_id TEXT,
  ADD COLUMN IF NOT EXISTS experiment_key TEXT,
  ADD COLUMN IF NOT EXISTS variant_key TEXT,
  ADD COLUMN IF NOT EXISTS first_page TEXT;

ALTER TABLE IF EXISTS "followiqs_experiment_events"
  ADD COLUMN IF NOT EXISTS anon_id TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS experiment_key TEXT,
  ADD COLUMN IF NOT EXISTS variant_key TEXT,
  ADD COLUMN IF NOT EXISTS page TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS props JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS "followiqs_page_views_created_at_idx"
  ON "followiqs_page_views" (created_at DESC);
CREATE INDEX IF NOT EXISTS "followiqs_page_views_experiment_idx"
  ON "followiqs_page_views" (experiment_key, variant_key, created_at DESC);
CREATE INDEX IF NOT EXISTS "followiqs_waitlist_experiment_idx"
  ON "followiqs_waitlist" (experiment_key, variant_key, created_at DESC);
CREATE INDEX IF NOT EXISTS "followiqs_experiment_assignments_lookup_idx"
  ON "followiqs_experiment_assignments" (experiment_key, anon_id);
CREATE INDEX IF NOT EXISTS "followiqs_experiment_events_created_at_idx"
  ON "followiqs_experiment_events" (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS "followiqs_experiment_events_experiment_idx"
  ON "followiqs_experiment_events" (experiment_key, variant_key, created_at DESC);

ALTER TABLE "followiqs_api_keys" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "followiqs_page_views" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "followiqs_experiment_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "followiqs_experiment_events" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "followiqs_api_keys_user_crud" ON "followiqs_api_keys";
CREATE POLICY "followiqs_api_keys_user_crud" ON "followiqs_api_keys" FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "followiqs_page_views_public_insert" ON "followiqs_page_views";
CREATE POLICY "followiqs_page_views_public_insert" ON "followiqs_page_views" FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "followiqs_experiment_assignments_public_access" ON "followiqs_experiment_assignments";
CREATE POLICY "followiqs_experiment_assignments_public_access" ON "followiqs_experiment_assignments" FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "followiqs_experiment_events_public_access" ON "followiqs_experiment_events";
CREATE POLICY "followiqs_experiment_events_public_access" ON "followiqs_experiment_events" FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "followiqs_experiment_assignments_updated_at" ON "followiqs_experiment_assignments";
CREATE TRIGGER "followiqs_experiment_assignments_updated_at"
  BEFORE UPDATE ON "followiqs_experiment_assignments"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS "followiqs_blog_posts" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Editorial Team',
  meta_title TEXT,
  meta_description TEXT,
  target_keyword TEXT,
  secondary_keywords TEXT[],
  faq JSONB DEFAULT '[]'::jsonb,
  key_takeaways TEXT[],
  category TEXT,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  related_slugs TEXT[],
  cta_type TEXT DEFAULT 'waitlist',
  seo_week_number INTEGER,
  generation_cost_usd REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "followiqs_blog_posts_slug_idx"
  ON "followiqs_blog_posts" (slug);
CREATE INDEX IF NOT EXISTS "followiqs_blog_posts_status_published_idx"
  ON "followiqs_blog_posts" (status, published_at DESC);

ALTER TABLE "followiqs_blog_posts" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "followiqs_blog_posts_public_read" ON "followiqs_blog_posts";
CREATE POLICY "followiqs_blog_posts_public_read" ON "followiqs_blog_posts" FOR SELECT TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "followiqs_blog_posts_service_all" ON "followiqs_blog_posts";
CREATE POLICY "followiqs_blog_posts_service_all" ON "followiqs_blog_posts" FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "followiqs_blog_posts_anon_insert" ON "followiqs_blog_posts";
CREATE POLICY "followiqs_blog_posts_anon_insert" ON "followiqs_blog_posts" FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "followiqs_blog_posts_anon_update" ON "followiqs_blog_posts";
CREATE POLICY "followiqs_blog_posts_anon_update" ON "followiqs_blog_posts" FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Ensure prefixed profiles table exists (template has unprefixed 'profiles',
-- but incubator pattern requires prefixed tables)
CREATE TABLE IF NOT EXISTS "followiqs_profiles" (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure profiles table has email column (for Stripe webhook user lookup)
ALTER TABLE IF EXISTS "followiqs_profiles"
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user_followiqs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."followiqs_profiles" (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS "on_auth_user_created_followiqs" ON auth.users;
CREATE TRIGGER "on_auth_user_created_followiqs"
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_followiqs();

ALTER TABLE IF EXISTS "followiqs_profiles" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "followiqs_profiles_select_own" ON "followiqs_profiles";
CREATE POLICY "followiqs_profiles_select_own" ON "followiqs_profiles" FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "followiqs_profiles_update_own" ON "followiqs_profiles";
CREATE POLICY "followiqs_profiles_update_own" ON "followiqs_profiles" FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "followiqs_profiles_service_role" ON "followiqs_profiles";
CREATE POLICY "followiqs_profiles_service_role" ON "followiqs_profiles" FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── Growth Activation schedules (seeded by Step 7.5) ──────────────
CREATE TABLE IF NOT EXISTS "followiqs_blog_schedule" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cadence_per_week INTEGER NOT NULL DEFAULT 1,
  topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  tone TEXT NOT NULL DEFAULT 'practical',
  next_post_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + interval '1 day'),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "followiqs_social_schedule" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platforms JSONB NOT NULL DEFAULT '["twitter","linkedin"]'::jsonb,
  cadence_per_week INTEGER NOT NULL DEFAULT 5,
  topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  next_post_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + interval '1 day'),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "followiqs_email_campaign_schedule" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequences JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE "followiqs_blog_schedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "followiqs_social_schedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "followiqs_email_campaign_schedule" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "followiqs_blog_schedule_service" ON "followiqs_blog_schedule";
CREATE POLICY "followiqs_blog_schedule_service" ON "followiqs_blog_schedule" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "followiqs_social_schedule_service" ON "followiqs_social_schedule";
CREATE POLICY "followiqs_social_schedule_service" ON "followiqs_social_schedule" FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "followiqs_email_campaign_schedule_service" ON "followiqs_email_campaign_schedule";
CREATE POLICY "followiqs_email_campaign_schedule_service" ON "followiqs_email_campaign_schedule" FOR ALL TO service_role USING (true) WITH CHECK (true);
