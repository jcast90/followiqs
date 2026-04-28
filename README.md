# Venture Template

A production-ready Next.js SaaS template optimized for AI agents. Agents write declarative JSON specs; the template compiles them into guaranteed-correct pages, SQL schemas, and navigation config.

**This template is consumed by the Venture OS build pipeline.** It is not designed for manual human development. All documentation is written for agent consumption.

## Agent Quick Start

```
1. Clone this repo
2. npm install
3. Copy .env.example → .env.local (fill in Supabase + Stripe keys)
4. Edit venture.config.json with product content
5. Edit venture.features.json with feature specs
6. npm run generate          → compiles feature specs into page.tsx files
7. npm run generate:schema   → compiles feature specs into SQL + RLS
8. npm run validate-imports  → checks all imports against allowlist
9. npm run build             → must pass before deploy
```

## Architecture

```
venture.config.json          ← Product identity (name, brand, landing copy, pricing)
venture.features.json        ← Feature specs (columns, stats, CRUD, render hints)
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
  generate-page.ts        generate-schema.ts      validate-imports.ts
          │                       │                       │
          ▼                       ▼                       ▼
  src/app/dashboard/        supabase/features/      exit code 0 or 1
  {slug}/page.tsx           {slug}.sql              (build safety net)
```

## What's Included

| Layer | What | Files |
|-------|------|-------|
| Landing page | 12 archetypes (warmth, precision, momentum, clarity, bold, organic, dashboard, minimal, marketplace, community, agentic, commerce), A/B testing, waitlist | `src/components/templates/` |
| Dashboard | Sidebar nav, stats, settings (billing, team, API keys) | `src/app/dashboard/` |
| Auth | OTP email login via Supabase Auth | `src/app/(auth)/login/` |
| Billing | Stripe checkout, subscriptions, webhooks, portal | `src/app/api/checkout/`, `src/app/api/webhooks/stripe/` |
| Email | Resend + Inngest 4-email drip campaign | `src/lib/inngest/` |
| Analytics | PostHog events + Sentry error tracking | `src/lib/analytics/` |
| Blog | Supabase-backed blog with ISR | `src/app/blog/` |
| Components | 25+ pre-styled blocks + 14 shadcn/ui components | `src/components/blocks/`, `src/components/ui/` |
| Codegen | Deterministic page + schema generation from JSON specs | `scripts/` |

## Tech Stack

- Next.js 16, React 19, TypeScript 5
- Tailwind CSS 4, shadcn/ui, Lucide icons
- Supabase (Postgres + Auth + RLS)
- Stripe, Resend, Inngest, PostHog, Sentry

## Codegen Pipeline

The primary way to add dashboard features. Agent writes JSON, template compiles to code.

### venture.features.json

Each feature defines columns, stats, CRUD operations, and render hints:

```json
{
  "features": [{
    "name": "Contacts",
    "slug": "contacts",
    "icon": "Users",
    "description": "Manage your contacts and leads.",
    "table": "contacts",
    "layout": "crud-table",
    "columns": [
      { "name": "name", "type": "text", "label": "Name", "required": true, "searchable": true, "render": "bold" },
      { "name": "email", "type": "email", "label": "Email", "searchable": true, "render": "email" },
      { "name": "status", "type": "select", "label": "Status", "options": ["active", "inactive", "lead"], "render": "status" },
      { "name": "revenue", "type": "numeric", "label": "Revenue", "render": "currency" }
    ],
    "stats": [
      { "title": "Total", "computed": "count", "icon": "Users" },
      { "title": "Active", "computed": "count", "filter": { "status": "active" } },
      { "title": "Revenue", "computed": "sum", "field": "revenue", "render": "currency" }
    ],
    "crud": { "create": true, "read": true, "update": true, "delete": true },
    "defaultSort": "created_at"
  }]
}
```

### Scripts

| Script | Command | Output |
|--------|---------|--------|
| `generate-page.ts` | `npm run generate` | `src/app/dashboard/{slug}/page.tsx` |
| `generate-schema.ts` | `npm run generate:schema` | `supabase/features/{slug}.sql` |
| `validate-imports.ts` | `npm run validate-imports` | Exit 0 (clean) or 1 (violations) |

Options:
- `npx tsx scripts/generate-page.ts contacts` — single feature
- `npx tsx scripts/generate-page.ts --force` — overwrite existing
- `npx tsx scripts/generate-schema.ts --append` — append to schema.sql

### Column types

| Type | TS | SQL | Form input | Render hints |
|------|-----|-----|------------|-------------|
| `text` | `string` | `TEXT` | `ThemedInput` | `bold`, `default` |
| `email` | `string` | `TEXT` | `ThemedInput type="email"` | `email` |
| `integer` | `number` | `INTEGER` | `ThemedInput type="number"` | `default` |
| `numeric` | `number` | `NUMERIC(10,2)` | `ThemedInput type="number"` | `currency` |
| `boolean` | `boolean` | `BOOLEAN` | (not in form) | `default` |
| `date` | `string` | `TIMESTAMPTZ` | `ThemedInput type="date"` | `date` |
| `select` | `string` | `TEXT CHECK(...)` | `Select` dropdown | `status` |

### Render hints

| Hint | Table display |
|------|---------------|
| `bold` | `<span className="font-medium text-white/80">` |
| `status` | `<StatusBadge status={value} />` |
| `date` | `new Date(value).toLocaleDateString()` |
| `currency` | `$value.toLocaleString()` |
| `email` | `<span className="text-white/60">` |

## Configuration

### venture.config.json

Controls product identity, landing page content, brand colors, dashboard nav, pricing tiers, and analytics. See `docs/agents/config-schema.md` for the full schema.

Key sections:
- `name`, `tagline`, `description`, `domain` — product identity
- `brand` — colors, gradients, border radius
- `landing` — headline, features, pricing, testimonials, FAQ
- `dashboard.navItems` — sidebar navigation (auto-updated by codegen)
- `flags.waitlistMode` — `true` for pre-launch, `false` for live

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL       # Required
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Required
NEXT_PUBLIC_TABLE_PREFIX       # For multi-tenant (e.g., "myapp_")
STRIPE_SECRET_KEY              # Payments
RESEND_API_KEY                 # Email
NEXT_PUBLIC_APP_URL            # Domain
SCREENSHOT_TOKEN               # Auth bypass for Playwright QA
```

## Agent Skills

| Skill | Purpose | Trigger |
|-------|---------|---------|
| `/add-feature` | Full pipeline: spec → page → schema → validate → build | Primary way to add features |
| `/add-page` | Hand-craft a non-CRUD page (prefer `/add-feature` for CRUD) | Custom layouts only |
| `/add-table` | Standalone SQL table (prefer `/add-feature` for feature tables) | Audit logs, queues |
| `/verify` | Import check → build → type check → lint | After any code changes |

## Agent Documentation

| File | Content |
|------|---------|
| `AGENTS.md` | Complete agent instructions — import rules, styling, DO NOTs, codegen pipeline |
| `docs/agents/example-page.txt` | Canonical example: exact output of the codegen pipeline |
| `docs/agents/blocks.md` | 25+ block components with props and usage |
| `docs/agents/imports.md` | Import paths, casing rules, available/blocked components |
| `docs/agents/styling.md` | CSS variables, brand system, color patterns |
| `docs/agents/page-pattern.md` | Page structure, CRUD pattern, state management |
| `docs/agents/schema.md` | SQL conventions, RLS, table patterns |
| `docs/agents/config-schema.md` | venture.config.json schema + validation rules |
| `docs/patterns.md` | Copy-pasteable CRUD page pattern |
| `docs/known-issues.md` | Lessons from past builds — read before starting |
| `scripts/lib/feature-schema.ts` | TypeScript interfaces for venture.features.json |

## Import Rules (Critical)

- Paths are **always lowercase**: `@/components/ui/card` (NOT `Card`)
- Components are **PascalCase**: `import { Card } from "@/components/ui/card"`
- Only import from the allowlist in `AGENTS.md` — the `validate-imports` script enforces this
- Select uses `onValueChange` (NOT `onChange`)
- **Not installed**: Accordion, Popover, Tooltip, Switch, Checkbox, RadioGroup, Progress, Slider, ScrollArea, Calendar, Form, Toast

## Deploy

```bash
npx vercel --prod
```

## Verification

```bash
npm run validate-imports  # Import check (instant)
npm run build             # Must pass
npx tsc --noEmit          # Type check
```
