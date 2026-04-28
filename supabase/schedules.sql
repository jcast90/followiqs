-- Growth Activation Schedules
--
-- These tables drive the downstream growth executor (blog posting, social
-- posting, email drip campaigns). Step 7.5 of the venture-os build
-- orchestrator seeds exactly one row into each table at build time with
-- `active = true` so the executor always has a config row to work with.
--
-- IMPORTANT: these are per-venture tables. In the shared incubator
-- deployment model, table names are prefixed (e.g. `chargelyt_blog_schedule`).
-- The venture-os build step applies the prefix via `build_runtime_schema_extensions`.
-- This file documents the canonical unprefixed shape for reference and for
-- legacy per-venture projects that don't use the prefix scheme.

CREATE TABLE IF NOT EXISTS blog_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cadence_per_week INTEGER NOT NULL DEFAULT 1,
    topics JSONB NOT NULL DEFAULT '[]'::jsonb,
    tone TEXT NOT NULL DEFAULT 'practical',
    next_post_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 day'),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platforms JSONB NOT NULL DEFAULT '["twitter","linkedin"]'::jsonb,
    cadence_per_week INTEGER NOT NULL DEFAULT 5,
    topics JSONB NOT NULL DEFAULT '[]'::jsonb,
    next_post_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 day'),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_campaign_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sequences JSONB NOT NULL DEFAULT '[]'::jsonb,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blog_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_schedule ENABLE ROW LEVEL SECURITY;

-- Service role has full access; no public/anon access to schedule config.
CREATE POLICY "Service role blog schedule" ON blog_schedule
    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role social schedule" ON social_schedule
    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role email schedule" ON email_campaign_schedule
    FOR ALL TO service_role USING (true) WITH CHECK (true);
