---
name: add-feature
description: Add a complete feature (page + schema + nav) from a declarative spec. This is the primary way to add dashboard features.
invocation: user
---

Add a complete dashboard feature using the codegen pipeline. The user provides the feature name as an argument (e.g., `/add-feature invoices`).

This skill orchestrates: feature spec → page codegen → SQL schema → import validation → build check.

## Steps

1. **Read `venture.features.json`** to see existing features
2. **Read `scripts/lib/feature-schema.ts`** to understand the spec interface (FeatureSpec, ColumnSpec, StatSpec)
3. **Read `venture.config.json`** for product context (name, description, existing navItems)
4. **Write the feature spec** — add a new entry to the `features` array in `venture.features.json`:
   - `name`: Display name (Title Case)
   - `slug`: URL slug (kebab-case) — this becomes `/dashboard/{slug}`
   - `icon`: Lucide icon name (PascalCase) — pick one that fits the feature
   - `description`: Short description for the page header
   - `table`: Supabase table name (snake_case)
   - `layout`: `"crud-table"` (only option for now)
   - `columns`: Array of column specs — each needs `name`, `type`, `label`. Set `render` hints: `"bold"` for primary column, `"status"` for status columns, `"date"` for dates, `"currency"` for money, `"email"` for emails
   - `stats`: 3-4 stat cards — use `"count"` with `filter` for filtered counts, `"sum"` with `field` for totals
   - `crud`: `{ create: true, read: true, update: true, delete: true }`
   - `defaultSort`: Usually `"created_at"`
5. **Run `npx tsx scripts/generate-page.ts {slug}`** — generates `src/app/dashboard/{slug}/page.tsx`
6. **Run `npx tsx scripts/generate-schema.ts {slug}`** — generates `supabase/features/{slug}.sql`
7. **Run `npx tsx scripts/validate-imports.ts`** — checks all imports are valid
8. **Run `npm run build`** — must compile cleanly
9. If any step fails, read the error, fix the spec or generated code, and re-run
10. **Optional**: After generation, customize the page (add charts, custom logic, adjust layout). The generated page is yours to own.

## Column types and render hints

| Column type | TS type | SQL type | Form input |
|-------------|---------|----------|------------|
| `text` | `string` | `TEXT` | `ThemedInput` |
| `email` | `string` | `TEXT` | `ThemedInput type="email"` |
| `integer` | `number` | `INTEGER` | `ThemedInput type="number"` |
| `numeric` | `number` | `NUMERIC(10,2)` | `ThemedInput type="number"` |
| `boolean` | `boolean` | `BOOLEAN` | (not in form) |
| `date` | `string` | `TIMESTAMPTZ` | `ThemedInput type="date"` |
| `select` | `string` | `TEXT CHECK(...)` | `Select` dropdown |

| Render hint | Table display |
|-------------|---------------|
| `bold` | `<span className="font-medium text-white/80">` |
| `status` | `<StatusBadge status={value} />` |
| `date` | `new Date(value).toLocaleDateString()` |
| `currency` | `$value.toLocaleString()` |
| `email` | `<span className="text-white/60">` |

## Example spec

```json
{
  "name": "Invoices",
  "slug": "invoices",
  "icon": "Receipt",
  "description": "Track and manage invoices.",
  "table": "invoices",
  "layout": "crud-table",
  "columns": [
    { "name": "title", "type": "text", "label": "Title", "required": true, "searchable": true, "render": "bold" },
    { "name": "amount", "type": "numeric", "label": "Amount", "required": true, "render": "currency" },
    { "name": "status", "type": "select", "label": "Status", "options": ["draft", "sent", "paid", "overdue"], "default": "draft", "render": "status" },
    { "name": "due_date", "type": "date", "label": "Due Date", "render": "date" }
  ],
  "stats": [
    { "title": "Total Invoices", "computed": "count", "icon": "Receipt" },
    { "title": "Paid", "computed": "count", "filter": { "status": "paid" } },
    { "title": "Total Revenue", "computed": "sum", "field": "amount", "render": "currency" }
  ],
  "crud": { "create": true, "read": true, "update": true, "delete": true },
  "defaultSort": "created_at"
}
```

## Rules
- Always use the codegen pipeline. Do NOT hand-write page.tsx for CRUD features.
- The generated page is ejectable — customize it after generation.
- Run `/verify` after any manual customizations.
