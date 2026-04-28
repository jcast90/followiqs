#!/usr/bin/env tsx
// CLI: Read venture.features.json → generate SQL schema files
// Usage:
//   npx tsx scripts/generate-schema.ts              # Generate all features
//   npx tsx scripts/generate-schema.ts contacts      # Generate single feature
//   npx tsx scripts/generate-schema.ts --append      # Append to supabase/schema.sql

import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "fs";
import { join } from "path";
import { validateFeatures } from "./lib/feature-schema.js";
import { generateSchemaSQL } from "./lib/sql-template.js";

import { fileURLToPath } from "url";
const __dirname = typeof import.meta.dirname === "string" ? import.meta.dirname : fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const FEATURES_PATH = join(ROOT, "venture.features.json");
const MIGRATIONS_DIR = join(ROOT, "supabase", "features");
const SCHEMA_PATH = join(ROOT, "supabase", "schema.sql");

// Parse args
const args = process.argv.slice(2);
const appendToSchema = args.includes("--append");
const targetSlug = args.find((a) => !a.startsWith("--"));

// Read and validate features
if (!existsSync(FEATURES_PATH)) {
  console.error("❌ venture.features.json not found. Create it first.");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(FEATURES_PATH, "utf-8"));
let features = validateFeatures(raw);

// Filter to single feature if slug provided
if (targetSlug) {
  features = features.filter((f) => f.slug === targetSlug);
  if (features.length === 0) {
    console.error(`❌ No feature found with slug "${targetSlug}"`);
    process.exit(1);
  }
}

// Ensure output directory exists
mkdirSync(MIGRATIONS_DIR, { recursive: true });

for (const feature of features) {
  const sql = generateSchemaSQL(feature);
  const filePath = join(MIGRATIONS_DIR, `${feature.slug}.sql`);

  writeFileSync(filePath, sql, "utf-8");
  console.log(`✅ Generated supabase/features/${feature.slug}.sql`);

  if (appendToSchema && existsSync(SCHEMA_PATH)) {
    appendFileSync(SCHEMA_PATH, "\n" + sql, "utf-8");
    console.log(`📎 Appended to supabase/schema.sql`);
  }
}

console.log(`\nDone: ${features.length} schema(s) generated`);
