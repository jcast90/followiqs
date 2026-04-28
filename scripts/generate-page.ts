#!/usr/bin/env tsx
// CLI: Read venture.features.json → generate dashboard page.tsx files
// Usage:
//   npx tsx scripts/generate-page.ts              # Generate all features
//   npx tsx scripts/generate-page.ts contacts      # Generate single feature
//   npx tsx scripts/generate-page.ts --force       # Overwrite existing files

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { validateFeatures } from "./lib/feature-schema.js";
import { generatePageSource } from "./lib/page-template.js";

import { fileURLToPath } from "url";
const __dirname = typeof import.meta.dirname === "string" ? import.meta.dirname : fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const FEATURES_PATH = join(ROOT, "venture.features.json");
const DASHBOARD_DIR = join(ROOT, "src", "app", "dashboard");
const CONFIG_PATH = join(ROOT, "venture.config.json");

// Parse args
const args = process.argv.slice(2);
const force = args.includes("--force");
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

let generated = 0;
let skipped = 0;

for (const feature of features) {
  const pageDir = join(DASHBOARD_DIR, feature.slug);
  const pagePath = join(pageDir, "page.tsx");

  if (existsSync(pagePath) && !force) {
    console.log(`⏭  ${feature.slug}/page.tsx already exists (use --force to overwrite)`);
    skipped++;
    continue;
  }

  // Generate page source
  const source = generatePageSource(feature);

  // Ensure directory exists
  mkdirSync(pageDir, { recursive: true });

  // Write page file
  writeFileSync(pagePath, source, "utf-8");
  console.log(`✅ Generated ${feature.slug}/page.tsx`);
  generated++;
}

// Update venture.config.json navItems for new features
if (generated > 0 && existsSync(CONFIG_PATH)) {
  try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    const navItems: Array<{ label: string; href: string; icon: string }> = config.dashboard?.navItems ?? [];

    let configChanged = false;
    for (const feature of features) {
      const href = `/dashboard/${feature.slug}`;
      const exists = navItems.some((item) => item.href === href);
      if (!exists) {
        // Insert before Settings (last item)
        const settingsIdx = navItems.findIndex((item) => item.href === "/dashboard/settings");
        const newItem = { label: feature.name, href, icon: feature.icon };
        if (settingsIdx >= 0) {
          navItems.splice(settingsIdx, 0, newItem);
        } else {
          navItems.push(newItem);
        }
        configChanged = true;
        console.log(`📌 Added "${feature.name}" to venture.config.json navItems`);
      }
    }

    if (configChanged) {
      config.dashboard.navItems = navItems;
      writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf-8");
    }
  } catch (e) {
    console.warn(`⚠️  Could not update venture.config.json: ${e}`);
  }
}

console.log(`\nDone: ${generated} generated, ${skipped} skipped`);
