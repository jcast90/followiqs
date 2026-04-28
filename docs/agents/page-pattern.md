Dashboard pages start with "use client";
USE @/components/blocks for all page structure — do NOT write raw Tailwind for layout/cards/tables/forms.
useState + useEffect for Supabase data via getRows/insertRow/updateRow/deleteRow
try/catch with realistic sample data fallback (3-5 rows matching product domain)
Stats: <StatsGrid stats={[...]} /> — pass array of { title, value, change, trend, icon }
Search: <SearchInput value={search} onChange={...} />
Table: <DataTable columns={columns} data={filtered} /> — define Column[] with render functions
Create/Edit: <FormDialog open={...} onOpenChange={...} title={...} onSubmit={...}> with <FormField> + <ThemedInput>
Primary buttons: <GradientButton icon={Plus}>Create</GradientButton>
Status display: <StatusBadge status="active" /> (success|warning|error|pending|completed|active|inactive)
Loading: <LoadingState />
Empty: <EmptyState title="No items yet" action={<GradientButton>Create</GradientButton>} />
Page wrapper: <PageShell><PageHeader title="..." description="..." action={...} />...</PageShell>
Every button must be functional — no placeholder onClick or # hrefs
Export default function — never export const
File placement: src/app/dashboard/[feature]/page.tsx

## Mobile-first responsive rules (QA runs at 375px AND 1280px — horizontal scroll FAILS the build)
- Stats grids: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
- Search/filter/Add rows: flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4
- Tables with >4 columns: use <ResponsiveDataList> from @/components/ui/responsive-data-list — it renders a desktop table at sm: and up, and <ResponsiveDataCard> items below sm:
- Secondary table columns: add className="hidden sm:table-cell" on both TableHead and TableCell
- Dialogs: className="max-w-[calc(100vw-2rem)] sm:max-w-lg"
- Page wrapper padding: px-4 py-6 sm:py-8 lg:px-8
- Buttons that stack on mobile: w-full sm:w-auto
- Long text in cells: truncate max-w-[150px] sm:max-w-none
- Sidebar is hidden at mobile (lg:flex); MobileHeader provides the nav Sheet
