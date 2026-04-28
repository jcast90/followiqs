<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes. Read `node_modules/next/dist/docs/` before writing any code.
<!-- END:nextjs-agent-rules -->

# Venture Template — Agent Instructions

## Overview
SaaS product template. Landing page, dashboard, OTP auth, Stripe billing — configured via `venture.config.json`.

**Stack**: Next.js 16 App Router, TypeScript, Tailwind CSS 4, shadcn/ui, Supabase (Postgres + Auth + RLS), Stripe, Resend

## Project Structure
```
src/app/                    # Routes (App Router)
  page.tsx                  # Landing (config-driven)
  (auth)/login/             # OTP login (6-digit email code)
  dashboard/                # Protected (auto-auth via middleware)
    layout.tsx              # Sidebar
    [feature]/page.tsx      # Add feature pages here
  api/                      # Server API routes
src/components/ui/          # shadcn (DO NOT edit — use npx shadcn add)
src/lib/supabase/           # client.ts, server.ts, db.ts (CRUD helpers)
venture.config.json         # All product content + nav + brand colors
supabase/schema.sql         # Database schema
```

## Building Dashboard Pages (CRITICAL — use blocks, not raw Tailwind)

**ALWAYS use `@/components/blocks` for dashboard pages.** These are pre-styled, theme-aware building blocks. Do NOT manually write Tailwind classes for layout, cards, stats, tables, forms, or status badges — the blocks handle all styling.

```tsx
import {
  PageShell, PageHeader, StatsGrid, SearchInput, DataTable,
  FormDialog, FormField, ThemedInput, GradientButton, StatusBadge,
  LoadingState, EmptyState, SectionCard, ThemedCard, IconBox,
  ListItem, ProgressBar, QuickAction,
} from "@/components/blocks";
import type { Column } from "@/components/blocks";
```

See `docs/agents/blocks.md` for full usage examples and the DataTable column pattern.

You still need `@/components/ui/button` for ghost/outline buttons in table actions, and `lucide-react` for icons.

## Import Rules (CRITICAL — builds fail if violated)

- File paths are ALWAYS lowercase: `@/components/ui/card` (NOT `@/components/ui/Card`)
- Component names are PascalCase: `import { Card } from "@/components/ui/card"`
- Icons are PascalCase from lucide-react: `import { Search, Plus } from "lucide-react"`
- ONLY import from files listed below — nothing else is installed

### Available components
```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
```

### Other imports
```tsx
import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/client";
import config from "@/lib/config";
import { Logo } from "@/components/logo";
```

## DO NOT
- Use uppercase import paths (`@/components/ui/Card` → wrong)
- Import unlisted components (Calendar, Form, Toast — NOT installed; use shadcn add to install if needed)
- Use `@radix-ui` directly — always import from `@/components/ui/`
- Use `onChange` on Select — use `onValueChange`
- Use password or OAuth login — OTP email only
- Create files in `src/components/ui/` — use `npx shadcn add`
- Create `src/utils/`, `src/helpers/`, `src/services/` — use `src/lib/`
- Add non-functional buttons, links, or UI elements — every clickable element must work (navigate, open a dialog, submit a form, or perform an action). No placeholder `#` hrefs, no `onClick={() => {}}` stubs, no "coming soon" buttons unless explicitly requested

## Page conventions
- Dashboard pages start with `"use client";`
- `useState` + `useEffect` for data, try/catch Supabase, fallback to sample data
- Loading: `<Loader2 className="size-6 animate-spin text-white/40" />`
- Page wrapper: `<div className="px-4 py-8 lg:px-8">`
- Create/edit via Dialog, delete via confirmation Dialog

## Styling
- Dark theme: `bg-brand-surface` (bg), `bg-brand-surface-light` (cards)
- Text: `text-white` / `text-white/60` / `text-white/40`
- Borders: `border-white/[0.06]`
- Cards: `className="border-white/[0.06] bg-brand-surface-light text-white"`
- Gradient buttons: `style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}`

## File placement
| What | Where |
|------|-------|
| Dashboard pages | `src/app/dashboard/[feature]/page.tsx` |
| API routes | `src/app/api/[name]/route.ts` |
| Hooks | `src/hooks/use-[name].ts` |
| Utilities | `src/lib/[name].ts` |
| Components | `src/components/[name].tsx` |
| DB schema | `supabase/schema.sql` |

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL       # Required — throws if missing
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Required — throws if missing
STRIPE_SECRET_KEY              # For payments
RESEND_API_KEY                 # For emails
NEXT_PUBLIC_APP_URL            # Your domain
```

## Auth Flow
1. `/login` → enter email → Supabase sends 6-digit OTP
2. Enter code → `verifyOtp` → redirect to `/dashboard`
3. New users auto-created (`shouldCreateUser: true`)
4. Middleware protects `/dashboard/*` → redirects to `/login` if unauthenticated

## Codegen Pipeline (preferred way to add features)

For CRUD dashboard pages, use the codegen pipeline instead of writing pages by hand:

1. **Define the feature** in `venture.features.json` — columns, stats, CRUD config, render hints
2. **Run `npm run generate`** — compiles spec → `src/app/dashboard/{slug}/page.tsx`
3. **Run `npm run generate:schema`** — compiles spec → `supabase/features/{slug}.sql`
4. **Run `npm run validate-imports`** — checks all dashboard imports against allowlist

Or use the `/add-feature` skill which orchestrates the full pipeline.

The feature spec (`venture.features.json`) is the single source of truth. Agent writes JSON (creative), template compiles to code (deterministic). See `scripts/lib/feature-schema.ts` for the spec interface.

Generated pages are **ejectable** — customize after generation. The codegen won't overwrite existing files unless `--force` is passed.

### Scripts
```bash
npm run generate                            # Generate all feature pages
npx tsx scripts/generate-page.ts contacts   # Generate single feature
npx tsx scripts/generate-page.ts --force    # Overwrite existing
npm run generate:schema                     # Generate SQL schemas
npm run validate-imports                    # Check import safety
```

## Testing
```bash
npm run validate-imports  # Import check
npm run build             # Must pass before deploy
npx tsc --noEmit          # Type check
```

## Self-healing: document what you learn

If you encounter a build error, runtime bug, or repeated issue while working on this project:

1. **Fix it** — resolve the immediate problem
2. **Check `docs/known-issues.md`** — has this been documented before?
3. **Document it** — append to `docs/known-issues.md` with this format:
   ```
   ### [Short description]
   **Error**: The error message or symptom
   **Cause**: Why it happened
   **Fix**: What resolved it
   ```
4. **Update rules if systemic** — if the same class of error happens 3+ times, add a rule to this `AGENTS.md` file (in the DO NOT section or Page conventions) so it's prevented at the source

Read `docs/known-issues.md` before starting work — it contains lessons from past builds.

## Reference docs (read on demand)
- `docs/known-issues.md` — Lessons from past builds (READ BEFORE STARTING)
- `docs/guide.md` — How to add pages, routes, tables, hooks + package doc links
- `docs/patterns.md` — Copy-pasteable CRUD page pattern
- `docs/components.md` — Component props and variants

## Memory-loadable conventions (for OpenFang build agents)
These small docs are loaded into OpenFang memory at build time for gpt-4.1-mini agents:
- `docs/agents/imports.md` → `conventions:imports` — import paths, casing, available components
- `docs/agents/styling.md` → `conventions:styling` — brand CSS vars, color patterns
- `docs/agents/page-pattern.md` → `conventions:page-pattern` — page structure, CRUD, states
- `docs/agents/schema.md` → `conventions:schema` — SQL conventions, RLS, base tables
- `docs/agents/config-schema.md` → `conventions:config` — venture.config.json schema + validation

## Hydration Safety (VOS-204)

React error #418 ("text content did not match server-rendered HTML") happens when a component renders different output on the server's SSR pass than on the client's hydration pass. Every new component in this template MUST follow these rules:

- **Never** call `new Date()`, `Date.now()`, `Math.random()`, or `crypto.randomUUID()` in the render body of a component. These return different values on each call.
  - Safe places: inside `useEffect` / `useMemo` / `useCallback` / an `async` function body / an event handler.
  - If you need a timestamp for server-rendered markup, compute it in a server component (or page loader) and pass it down via props.
- **Never** read `localStorage`, `sessionStorage`, `document`, or `window` at module scope or during render. Gate inside `useEffect`, and lazy-initialize state so SSR sees a stable default.
- **Always** add `"use client"` at the top of any file that uses React hooks (`useState`, `useEffect`, `useRef`, etc.) or reads browser-only APIs.
- **Intl formatting**: never call `.toLocaleString()`, `.toLocaleDateString()`, `new Intl.DateTimeFormat()`, or `new Intl.NumberFormat()` with no arguments. Pass an explicit locale (`"en-US"`) and, for dates, an explicit `timeZone` (`"UTC"` is the safest default). Example:
  ```ts
  const DATE_FMT = new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "2-digit", timeZone: "UTC",
  });
  ```
- Do **not** use `suppressHydrationWarning` to paper over a mismatch — fix the underlying cause.

The page-generator in venture-os runs `scripts/lib/hydration_linter.py` against every generated page and retries once with these rules if violations are detected. Handwritten archetype components must also follow the rules so the linter stays useful.

## Archetype component library (VOS-206)

Pre-built, purpose-specific page shells live under `src/components/archetypes/<slug>/`.
When `venture.config.json` selects an archetype with `schema_free=true`, the Python
build pipeline copies shells from `<slug>/pages/*.page.tsx` instead of generating
schema-driven CRUD pages. Shipped archetypes:

- `dev-tool-repo-audit/` — connect repos, run audits, view diff (VOS-206 foundation)
- `workflow-automation/` — flows, step inspector, triggers, run timeline
- `pipeline-runner/` — jobs, live logs, queue, artifacts
- `integration-hub/` — connectors, OAuth install, field mappings, sync log

All archetype components are client components (`"use client"`) using shadcn
primitives from `@/components/ui/*`. They use literal ISO strings and fixed
IDs (no `new Date()` / `Math.random()` in render) so SSR output matches
client hydration. Placeholder `__VENTURE_NAME__` gets swapped at build time
by `scripts/lib/page_fallbacks_archetype.py` in venture-os.
