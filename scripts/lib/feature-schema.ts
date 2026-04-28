// Feature specification types and validation for venture.features.json
// This is the contract between agent-written JSON and the codegen pipeline.

export type ColumnType = "text" | "integer" | "numeric" | "boolean" | "date" | "select" | "email";
export type RenderHint = "bold" | "status" | "date" | "currency" | "email" | "default";
export type StatComputed = "count" | "sum";
export type LayoutType = "crud-table";

export interface ColumnSpec {
  name: string;         // DB column name (snake_case)
  type: ColumnType;
  label: string;        // Human label for table header and form
  required?: boolean;
  searchable?: boolean; // Included in search filter
  inTable?: boolean;    // Show in DataTable (default: true)
  inForm?: boolean;     // Show in create/edit FormDialog (default: true)
  render?: RenderHint;  // Render hint for DataTable column
  placeholder?: string; // Form input placeholder
  options?: string[];   // For select type only
  default?: string;     // Default value
}

export interface StatSpec {
  title: string;
  computed: StatComputed;
  field?: string;                      // Required for "sum"
  filter?: Record<string, string>;     // For filtered counts
  icon?: string;                       // Lucide icon name
  render?: "currency";                 // Output formatting
}

export interface CrudSpec {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface FeatureSpec {
  name: string;          // Display name (e.g., "Contacts")
  slug: string;          // URL slug (kebab-case)
  icon: string;          // Lucide icon name (PascalCase)
  description: string;
  table: string;         // Supabase table name (snake_case, no prefix)
  layout: LayoutType;
  columns: ColumnSpec[];
  stats: StatSpec[];
  crud: CrudSpec;
  defaultSort: string;
  sampleData?: number;   // Number of sample rows (default: 3)
}

export interface FeaturesFile {
  features: FeatureSpec[];
}

// --- Validation ---

function assertString(val: unknown, path: string): asserts val is string {
  if (typeof val !== "string" || val.length === 0) {
    throw new Error(`${path} must be a non-empty string`);
  }
}

function assertArray(val: unknown, path: string): asserts val is unknown[] {
  if (!Array.isArray(val)) {
    throw new Error(`${path} must be an array`);
  }
}

const VALID_COLUMN_TYPES: ColumnType[] = ["text", "integer", "numeric", "boolean", "date", "select", "email"];
const VALID_RENDER_HINTS: RenderHint[] = ["bold", "status", "date", "currency", "email", "default"];
const VALID_STAT_COMPUTED: StatComputed[] = ["count", "sum"];

function validateColumn(col: unknown, path: string): ColumnSpec {
  if (typeof col !== "object" || col === null) {
    throw new Error(`${path} must be an object`);
  }
  const c = col as Record<string, unknown>;

  assertString(c.name, `${path}.name`);
  assertString(c.type, `${path}.type`);
  assertString(c.label, `${path}.label`);

  if (!VALID_COLUMN_TYPES.includes(c.type as ColumnType)) {
    throw new Error(`${path}.type must be one of: ${VALID_COLUMN_TYPES.join(", ")} (got "${c.type}")`);
  }

  if (c.render !== undefined) {
    if (!VALID_RENDER_HINTS.includes(c.render as RenderHint)) {
      throw new Error(`${path}.render must be one of: ${VALID_RENDER_HINTS.join(", ")} (got "${c.render}")`);
    }
  }

  if (c.type === "select") {
    if (!Array.isArray(c.options) || c.options.length === 0) {
      throw new Error(`${path}.options is required for select columns and must be a non-empty array`);
    }
  }

  return {
    name: c.name as string,
    type: c.type as ColumnType,
    label: c.label as string,
    required: c.required === true,
    searchable: c.searchable === true,
    inTable: c.inTable !== false,    // default true
    inForm: c.inForm !== false,      // default true
    render: (c.render as RenderHint) ?? "default",
    placeholder: (c.placeholder as string) ?? "",
    options: (c.options as string[]) ?? [],
    default: (c.default as string) ?? "",
  };
}

function validateStat(stat: unknown, path: string): StatSpec {
  if (typeof stat !== "object" || stat === null) {
    throw new Error(`${path} must be an object`);
  }
  const s = stat as Record<string, unknown>;

  assertString(s.title, `${path}.title`);
  assertString(s.computed, `${path}.computed`);

  if (!VALID_STAT_COMPUTED.includes(s.computed as StatComputed)) {
    throw new Error(`${path}.computed must be one of: ${VALID_STAT_COMPUTED.join(", ")}`);
  }

  if (s.computed === "sum" && typeof s.field !== "string") {
    throw new Error(`${path}.field is required when computed is "sum"`);
  }

  return {
    title: s.title as string,
    computed: s.computed as StatComputed,
    field: (s.field as string) ?? undefined,
    filter: (s.filter as Record<string, string>) ?? undefined,
    icon: (s.icon as string) ?? undefined,
    render: s.render === "currency" ? "currency" : undefined,
  };
}

function validateCrud(crud: unknown, path: string): CrudSpec {
  if (typeof crud !== "object" || crud === null) {
    throw new Error(`${path} must be an object`);
  }
  const c = crud as Record<string, unknown>;
  return {
    create: c.create === true,
    read: c.read !== false,
    update: c.update === true,
    delete: c.delete === true,
  };
}

function validateFeature(feat: unknown, path: string): FeatureSpec {
  if (typeof feat !== "object" || feat === null) {
    throw new Error(`${path} must be an object`);
  }
  const f = feat as Record<string, unknown>;

  assertString(f.name, `${path}.name`);
  assertString(f.slug, `${path}.slug`);
  assertString(f.icon, `${path}.icon`);
  assertString(f.description, `${path}.description`);
  assertString(f.table, `${path}.table`);

  // Validate slug is kebab-case
  if (!/^[a-z][a-z0-9-]*$/.test(f.slug as string)) {
    throw new Error(`${path}.slug must be kebab-case (got "${f.slug}")`);
  }

  // Validate table is snake_case
  if (!/^[a-z][a-z0-9_]*$/.test(f.table as string)) {
    throw new Error(`${path}.table must be snake_case (got "${f.table}")`);
  }

  const layout = (f.layout as string) ?? "crud-table";
  if (layout !== "crud-table") {
    throw new Error(`${path}.layout must be "crud-table" (got "${layout}"). Other layouts coming soon.`);
  }

  assertArray(f.columns, `${path}.columns`);
  if ((f.columns as unknown[]).length === 0) {
    throw new Error(`${path}.columns must have at least one column`);
  }

  assertArray(f.stats, `${path}.stats`);

  const columns = (f.columns as unknown[]).map((c, i) => validateColumn(c, `${path}.columns[${i}]`));
  const stats = (f.stats as unknown[]).map((s, i) => validateStat(s, `${path}.stats[${i}]`));
  const crud = validateCrud(f.crud, `${path}.crud`);

  return {
    name: f.name as string,
    slug: f.slug as string,
    icon: f.icon as string,
    description: f.description as string,
    table: f.table as string,
    layout: layout as LayoutType,
    columns,
    stats,
    crud,
    defaultSort: (f.defaultSort as string) ?? "created_at",
    sampleData: typeof f.sampleData === "number" ? f.sampleData : 3,
  };
}

export function validateFeatures(json: unknown): FeatureSpec[] {
  if (typeof json !== "object" || json === null) {
    throw new Error("venture.features.json must be a JSON object");
  }
  const root = json as Record<string, unknown>;

  assertArray(root.features, "features");
  if ((root.features as unknown[]).length === 0) {
    throw new Error("features array must have at least one feature");
  }

  const features = (root.features as unknown[]).map((f, i) => validateFeature(f, `features[${i}]`));

  // Check for duplicate slugs
  const slugs = new Set<string>();
  for (const f of features) {
    if (slugs.has(f.slug)) {
      throw new Error(`Duplicate feature slug: "${f.slug}"`);
    }
    slugs.add(f.slug);
  }

  return features;
}
