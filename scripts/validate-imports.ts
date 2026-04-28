#!/usr/bin/env tsx
// CLI: Scan dashboard pages for invalid imports
// Usage:
//   npx tsx scripts/validate-imports.ts
// Exit code 0 = clean, 1 = violations found

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { checkImport } from "./lib/import-allowlist.js";

import { fileURLToPath } from "url";
const __dirname = typeof import.meta.dirname === "string" ? import.meta.dirname : fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const SCAN_DIR = join(ROOT, "src", "app", "dashboard");

interface Violation {
  file: string;
  line: number;
  importPath: string;
  reason: string;
}

// Recursively find all .tsx files
function findTsxFiles(dir: string): string[] {
  const results: string[] = [];
  if (!statSync(dir, { throwIfNoEntry: false })) return results;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findTsxFiles(fullPath));
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      results.push(fullPath);
    }
  }
  return results;
}

// Extract import paths from a file
const IMPORT_RE = /^import\s+(?:.*?\s+from\s+)?["']([^"']+)["']/gm;

function extractImports(content: string): Array<{ path: string; line: number }> {
  const imports: Array<{ path: string; line: number }> = [];
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    IMPORT_RE.lastIndex = 0;
    const match = IMPORT_RE.exec(lines[i]);
    if (match) {
      imports.push({ path: match[1], line: i + 1 });
    }
  }
  return imports;
}

// Run validation
const files = findTsxFiles(SCAN_DIR);
const violations: Violation[] = [];

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const imports = extractImports(content);

  for (const imp of imports) {
    const result = checkImport(imp.path);
    if (!result.valid) {
      violations.push({
        file: relative(ROOT, file),
        line: imp.line,
        importPath: imp.path,
        reason: result.reason!,
      });
    }
  }
}

// Report
if (violations.length === 0) {
  console.log(`✅ All imports valid across ${files.length} file(s)`);
} else {
  console.error(`❌ Found ${violations.length} import violation(s):\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}`);
    console.error(`    Import: ${v.importPath}`);
    console.error(`    Reason: ${v.reason}\n`);
  }
}

// Use appropriate exit code
const exitCode = violations.length > 0 ? 1 : 0;
setTimeout(() => { throw new SystemExit(exitCode); }, 0);

class SystemExit extends Error {
  code: number;
  constructor(code: number) {
    super();
    this.code = code;
    // eslint-disable-next-line no-process-exit
    process.exit(code);
  }
}
