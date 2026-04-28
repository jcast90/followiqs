// Page codegen: feature spec → complete working page.tsx
// Output matches the exact pattern from docs/patterns.md

import type { FeatureSpec, ColumnSpec, StatSpec } from "./feature-schema.js";

// --- TypeScript type mapping ---

const TS_TYPE_MAP: Record<string, string> = {
  text: "string",
  email: "string",
  select: "string",
  integer: "number",
  numeric: "number",
  boolean: "boolean",
  date: "string",
};

// --- Sample data generation ---

function sampleValue(col: ColumnSpec, index: number): string {
  switch (col.type) {
    case "text":
      return `"${col.label} ${index + 1}"`;
    case "email":
      return `"user${index + 1}@example.com"`;
    case "select":
      return `"${col.options![index % col.options!.length]}"`;
    case "integer":
      return String((index + 1) * 10);
    case "numeric":
      return String(((index + 1) * 1250.5).toFixed(2));
    case "boolean":
      return index % 2 === 0 ? "true" : "false";
    case "date":
      return "new Date().toISOString()";
    default:
      return `"sample-${index + 1}"`;
  }
}

// --- Render hint → JSX snippet ---

function renderColumn(col: ColumnSpec): string | null {
  const field = `row.${col.name}`;
  switch (col.render) {
    case "bold":
      return `(row) => <span className="font-medium text-white/80">{${field}}</span>`;
    case "status":
      return `(row) => <StatusBadge status={${field}} />`;
    case "date":
      return `(row) => (\n        <span className="text-white/40">\n          {${field} ? new Date(${field}).toLocaleDateString() : "—"}\n        </span>\n      )`;
    case "currency":
      return `(row) => (\n        <span className="text-white/80">\n          \$\{Number(${field}).toLocaleString()}\n        </span>\n      )`;
    case "email":
      return `(row) => <span className="text-white/60">{${field}}</span>`;
    default:
      return null;
  }
}

// --- Form field → JSX snippet ---

function formField(col: ColumnSpec): string {
  const setter = `setForm${pascal(col.name)}`;
  const getter = `form${pascal(col.name)}`;

  if (col.type === "select" && col.options!.length > 0) {
    const optionItems = col.options!
      .map((o) => `              <SelectItem value="${o}">${capitalize(o)}</SelectItem>`)
      .join("\n");
    return `        <FormField label="${col.label}">
          <Select value={${getter}} onValueChange={(v) => ${setter}(v ?? "")}>
            <SelectTrigger className="border-white/[0.06] bg-brand-surface-input text-white">
              <SelectValue placeholder="Select ${col.label.toLowerCase()}..." />
            </SelectTrigger>
            <SelectContent>
${optionItems}
            </SelectContent>
          </Select>
        </FormField>`;
  }

  const inputType = col.type === "email" ? "email"
    : col.type === "integer" || col.type === "numeric" ? "number"
    : col.type === "date" ? "date"
    : "text";

  return `        <FormField label="${col.label}">
          <ThemedInput
            type="${inputType}"
            value={${getter}}
            onChange={(e) => ${setter}(e.target.value)}
            placeholder="${col.placeholder || `Enter ${col.label.toLowerCase()}...`}"
          />
        </FormField>`;
}

// --- Stat computation → JS expression ---

function statExpression(stat: StatSpec): string {
  let expr: string;

  if (stat.computed === "count") {
    if (stat.filter) {
      const conditions = Object.entries(stat.filter)
        .map(([k, v]) => `i.${k} === "${v}"`)
        .join(" && ");
      expr = `String(items.filter((i) => ${conditions}).length)`;
    } else {
      expr = `String(items.length)`;
    }
  } else {
    // sum
    expr = `String(items.reduce((s, i) => s + Number(i.${stat.field}), 0))`;
  }

  if (stat.render === "currency") {
    // Replace String(...) wrapper with currency formatting
    if (stat.computed === "count") {
      expr = expr; // counts don't get currency formatting
    } else {
      const inner = `items.reduce((s, i) => s + Number(i.${stat.field}), 0)`;
      expr = `"$" + ${inner}.toLocaleString()`;
    }
  }

  return expr;
}

// --- Helpers ---

function pascal(str: string): string {
  return str.replace(/(^|_)([a-z])/g, (_, __, c) => c.toUpperCase());
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Main generator ---

export function generatePageSource(feature: FeatureSpec): string {
  const interfaceName = pascal(feature.slug.replace(/-/g, "_"));
  const pageName = `${interfaceName}Page`;
  const tableCols = feature.columns.filter((c) => c.inTable);
  const formCols = feature.columns.filter((c) => c.inForm);
  const searchableCols = feature.columns.filter((c) => c.searchable);
  const hasStatus = feature.columns.some((c) => c.render === "status");
  const hasSelect = formCols.some((c) => c.type === "select");
  const hasCreate = feature.crud.create;
  const hasUpdate = feature.crud.update;
  const hasDelete = feature.crud.delete;
  const hasCrud = hasCreate || hasUpdate || hasDelete;
  const hasForm = hasCreate || hasUpdate;
  const sampleCount = feature.sampleData ?? 3;

  // --- Collect icons ---
  const icons = new Set<string>([feature.icon]);
  if (hasCreate) icons.add("Plus");
  if (hasUpdate) icons.add("Pencil");
  if (hasDelete) icons.add("Trash2");
  feature.stats.forEach((s) => { if (s.icon) icons.add(s.icon); });

  // --- Build imports ---
  const blockImports = [
    "PageShell",
    "PageHeader",
    "StatsGrid",
    "SearchInput",
    "DataTable",
    "LoadingState",
    "EmptyState",
  ];
  if (hasForm) blockImports.push("FormDialog", "FormField", "ThemedInput");
  if (hasCreate) blockImports.push("GradientButton");
  if (hasStatus) blockImports.push("StatusBadge");

  const uiImports: string[] = [];
  if (hasCrud) uiImports.push("Button");
  if (hasSelect) uiImports.push("Select", "SelectContent", "SelectItem", "SelectTrigger", "SelectValue");

  // --- Build interface ---
  const interfaceFields = [
    "  [key: string]: unknown;",
    "  id: string;",
    ...feature.columns.map((c) => {
      const optional = c.required ? "" : "?";
      return `  ${c.name}${optional}: ${TS_TYPE_MAP[c.type] ?? "string"};`;
    }),
    "  created_at: string;",
    "  updated_at: string;",
  ];

  // --- Build sample data ---
  const sampleRows: string[] = [];
  for (let i = 0; i < sampleCount; i++) {
    const fields = [
      `id: "${i + 1}"`,
      ...feature.columns.map((c) => `${c.name}: ${sampleValue(c, i)}`),
      "created_at: new Date().toISOString()",
      "updated_at: new Date().toISOString()",
    ];
    sampleRows.push(`  { ${fields.join(", ")} }`);
  }

  // --- Build form state declarations ---
  const formStates = formCols.map((c) => {
    const name = `form${pascal(c.name)}`;
    const defaultVal = c.type === "select" && c.default ? `"${c.default}"` : '""';
    return `  const [${name}, set${pascal(c.name[0].toUpperCase() + c.name.slice(1))}] = useState(${defaultVal});`;
  });
  // Fix: use consistent naming
  const formStateLines = formCols.map((c) => {
    const pname = pascal(c.name);
    const defaultVal = c.type === "select" && c.default ? `"${c.default}"` : '""';
    return `  const [form${pname}, setForm${pname}] = useState(${defaultVal});`;
  });

  // --- Build handleSave body ---
  const saveFields = formCols.map((c) => {
    const pname = pascal(c.name);
    const val = c.type === "integer" || c.type === "numeric"
      ? `Number(form${pname})`
      : `form${pname}`;
    return `${c.name}: ${val}`;
  });

  // --- Build openEdit setters ---
  const editSetters = formCols.map((c) => {
    const pname = pascal(c.name);
    const val = c.type === "integer" || c.type === "numeric"
      ? `String(item.${c.name})`
      : `item.${c.name}`;
    return `    setForm${pname}(${val});`;
  });

  // --- Build resetForm ---
  const resetSetters = formCols.map((c) => {
    const pname = pascal(c.name);
    const defaultVal = c.type === "select" && c.default ? `"${c.default}"` : '""';
    return `setForm${pname}(${defaultVal})`;
  });

  // --- Build search filter ---
  const searchExpr = searchableCols.length > 0
    ? searchableCols
        .map((c) => `i.${c.name}?.toLowerCase().includes(search.toLowerCase())`)
        .join(" ||\n      ")
    : `String(i.id).includes(search)`;

  // --- Build stats array ---
  const statsEntries = feature.stats.map((s) => {
    const parts = [`title: "${s.title}"`, `value: ${statExpression(s)}`];
    if (s.icon) parts.push(`icon: ${s.icon}`);
    return `    { ${parts.join(", ")} }`;
  });

  // --- Build columns array ---
  const columnEntries: string[] = [];
  for (const col of tableCols) {
    const parts = [`key: "${col.name}"`, `header: "${col.label}"`];
    const renderFn = renderColumn(col);
    if (renderFn) {
      parts.push(`render: ${renderFn}`);
    }
    columnEntries.push(`    {\n      ${parts.join(",\n      ")},\n    }`);
  }

  // Actions column
  if (hasUpdate || hasDelete) {
    const actionButtons: string[] = [];
    if (hasUpdate) {
      actionButtons.push(
        `          <Button variant="ghost" size="icon-xs" onClick={() => openEdit(row)}>
            <Pencil className="size-3.5" />
          </Button>`
      );
    }
    if (hasDelete) {
      actionButtons.push(
        `          <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(row.id)}>
            <Trash2 className="size-3.5 text-red-400" />
          </Button>`
      );
    }
    columnEntries.push(`    {
      key: "id",
      header: "Actions",
      align: "right" as const,
      render: (row) => (
        <div className="space-x-1">
${actionButtons.join("\n")}
        </div>
      ),
    }`);
  }

  // --- Build form fields ---
  const formFieldsJSX = formCols.map(formField).join("\n");

  // --- Assemble the page ---
  const lines: string[] = [];

  // Directive
  lines.push(`"use client";`);
  lines.push(``);

  // Imports
  lines.push(`import { useEffect, useState } from "react";`);
  lines.push(`import {`);
  lines.push(`  ${blockImports.join(",\n  ")},`);
  lines.push(`} from "@/components/blocks";`);
  lines.push(`import type { Column } from "@/components/blocks";`);

  if (uiImports.includes("Button")) {
    lines.push(`import { Button } from "@/components/ui/button";`);
  }
  if (hasSelect) {
    lines.push(`import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";`);
  }

  // DB imports
  const dbImports: string[] = ["getRows"];
  if (hasCreate || hasUpdate) dbImports.push("insertRow");
  if (hasUpdate) dbImports.push("updateRow");
  if (hasDelete) dbImports.push("deleteRow");
  // dedupe insertRow if both create and update
  const uniqueDbImports = [...new Set(dbImports)];
  lines.push(`import { ${uniqueDbImports.join(", ")} } from "@/lib/supabase/db";`);

  // Icons
  lines.push(`import { ${[...icons].join(", ")} } from "lucide-react";`);
  lines.push(``);

  // Interface
  lines.push(`interface ${interfaceName} {`);
  lines.push(interfaceFields.join("\n"));
  lines.push(`}`);
  lines.push(``);

  // Sample data
  lines.push(`const SAMPLE: ${interfaceName}[] = [`);
  lines.push(sampleRows.join(",\n"));
  lines.push(`];`);
  lines.push(``);

  // Component
  lines.push(`export default function ${pageName}() {`);
  lines.push(`  const [items, setItems] = useState<${interfaceName}[]>([]);`);
  lines.push(`  const [loading, setLoading] = useState(true);`);
  lines.push(`  const [search, setSearch] = useState("");`);

  if (hasForm) {
    lines.push(`  const [dialogOpen, setDialogOpen] = useState(false);`);
    lines.push(`  const [editItem, setEditItem] = useState<${interfaceName} | null>(null);`);
    // Form state
    for (const line of formStateLines) {
      lines.push(line);
    }
  }

  lines.push(``);

  // load function
  lines.push(`  async function load() {`);
  lines.push(`    try {`);
  lines.push(`      const rows = await getRows<${interfaceName}>("${feature.table}", { orderBy: "${feature.defaultSort}" });`);
  lines.push(`      setItems(rows.length > 0 ? rows : SAMPLE);`);
  lines.push(`    } catch {`);
  lines.push(`      setItems(SAMPLE);`);
  lines.push(`    } finally {`);
  lines.push(`      setLoading(false);`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  useEffect(() => { load(); }, []);`);
  lines.push(``);

  // handleSave
  if (hasForm) {
    lines.push(`  async function handleSave() {`);
    if (hasUpdate) {
      lines.push(`    if (editItem) {`);
      lines.push(`      await updateRow("${feature.table}", editItem.id, { ${saveFields.join(", ")} });`);
      lines.push(`    } else {`);
      lines.push(`      await insertRow("${feature.table}", { ${saveFields.join(", ")} });`);
      lines.push(`    }`);
    } else {
      lines.push(`    await insertRow("${feature.table}", { ${saveFields.join(", ")} });`);
    }
    lines.push(`    setDialogOpen(false);`);
    lines.push(`    setEditItem(null);`);
    lines.push(`    ${resetSetters.join("; ")};`);
    lines.push(`    load();`);
    lines.push(`  }`);
    lines.push(``);
  }

  // handleDelete
  if (hasDelete) {
    lines.push(`  async function handleDelete(id: string) {`);
    lines.push(`    await deleteRow("${feature.table}", id);`);
    lines.push(`    load();`);
    lines.push(`  }`);
    lines.push(``);
  }

  // openEdit
  if (hasUpdate) {
    lines.push(`  function openEdit(item: ${interfaceName}) {`);
    lines.push(`    setEditItem(item);`);
    for (const setter of editSetters) {
      lines.push(setter);
    }
    lines.push(`    setDialogOpen(true);`);
    lines.push(`  }`);
    lines.push(``);
  }

  // Loading state
  lines.push(`  if (loading) return <LoadingState />;`);
  lines.push(``);

  // Search filter
  lines.push(`  const filtered = items.filter((i) =>`);
  lines.push(`    ${searchExpr}`);
  lines.push(`  );`);
  lines.push(``);

  // Stats
  lines.push(`  const stats = [`);
  lines.push(statsEntries.join(",\n"));
  lines.push(`  ];`);
  lines.push(``);

  // Columns
  lines.push(`  const columns: Column<${interfaceName}>[] = [`);
  lines.push(columnEntries.join(",\n"));
  lines.push(`  ];`);
  lines.push(``);

  // JSX return
  lines.push(`  return (`);
  lines.push(`    <PageShell>`);
  lines.push(`      <PageHeader`);
  lines.push(`        title="${feature.name}"`);
  lines.push(`        description="${feature.description}"`);

  if (hasCreate) {
    lines.push(`        action={`);
    lines.push(`          <GradientButton icon={Plus} onClick={() => setDialogOpen(true)}>`);
    lines.push(`            Create`);
    lines.push(`          </GradientButton>`);
    lines.push(`        }`);
  }

  lines.push(`      />`);
  lines.push(``);
  lines.push(`      <StatsGrid stats={stats} />`);
  lines.push(``);
  lines.push(`      <SearchInput`);
  lines.push(`        value={search}`);
  lines.push(`        onChange={(e) => setSearch(e.target.value)}`);
  lines.push(`        placeholder="Search ${feature.name.toLowerCase()}..."`);
  lines.push(`        containerClassName="mb-4"`);
  lines.push(`      />`);
  lines.push(``);
  lines.push(`      {filtered.length > 0 ? (`);
  lines.push(`        <DataTable columns={columns} data={filtered} />`);
  lines.push(`      ) : (`);
  lines.push(`        <EmptyState`);
  lines.push(`          icon={${feature.icon}}`);
  lines.push(`          title="No ${feature.name.toLowerCase()} found"`);
  lines.push(`          description={search ? "Try a different search term." : "Create your first ${feature.slug.replace(/-/g, " ")} to get started."}`);

  if (hasCreate) {
    lines.push(`          action={`);
    lines.push(`            !search ? (`);
    lines.push(`              <GradientButton icon={Plus} onClick={() => setDialogOpen(true)}>`);
    lines.push(`                Create ${feature.name}`);
    lines.push(`              </GradientButton>`);
    lines.push(`            ) : undefined`);
    lines.push(`          }`);
  }

  lines.push(`        />`);
  lines.push(`      )}`);

  // Form dialog
  if (hasForm) {
    lines.push(``);
    lines.push(`      <FormDialog`);
    lines.push(`        open={dialogOpen}`);
    lines.push(`        onOpenChange={(o) => {`);
    lines.push(`          setDialogOpen(o);`);
    lines.push(`          if (!o) { setEditItem(null); ${resetSetters.join("; ")}; }`);
    lines.push(`        }}`);
    lines.push(`        title={editItem ? "Edit ${feature.name}" : "Create ${feature.name}"}`);
    lines.push(`        onSubmit={handleSave}`);
    lines.push(`      >`);
    lines.push(formFieldsJSX);
    lines.push(`      </FormDialog>`);
  }

  lines.push(`    </PageShell>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);

  return lines.join("\n");
}
