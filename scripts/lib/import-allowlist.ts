// Allowed import paths for dashboard pages.
// Derived from AGENTS.md — the single source of truth for import rules.

export const ALLOWED_IMPORTS: string[] = [
  // Block components
  "@/components/blocks",
  // UI components (shadcn)
  "@/components/ui/card",
  "@/components/ui/button",
  "@/components/ui/input",
  "@/components/ui/label",
  "@/components/ui/textarea",
  "@/components/ui/select",
  "@/components/ui/table",
  "@/components/ui/dialog",
  "@/components/ui/sheet",
  "@/components/ui/dropdown-menu",
  "@/components/ui/badge",
  "@/components/ui/separator",
  "@/components/ui/avatar",
  "@/components/ui/tabs",
  "@/components/ui/accordion",
  "@/components/ui/alert",
  "@/components/ui/breadcrumb",
  "@/components/ui/checkbox",
  "@/components/ui/collapsible",
  "@/components/ui/hover-card",
  "@/components/ui/popover",
  "@/components/ui/progress",
  "@/components/ui/radio-group",
  "@/components/ui/scroll-area",
  "@/components/ui/skeleton",
  "@/components/ui/slider",
  "@/components/ui/switch",
  "@/components/ui/tooltip",
  // Lib
  "@/lib/supabase/db",
  "@/lib/supabase/client",
  "@/lib/supabase/server",
  "@/lib/config",
  "@/lib/utils",
  // Components
  "@/components/logo",
  "@/components/dashboard/sidebar",
  "@/components/dashboard/mobile-header",
  "@/components/dashboard/layouts/sidebar-layout",
  "@/components/dashboard/layouts/topnav",
  "@/components/dashboard/layouts/command-layout",
  // External packages
  "react",
  "lucide-react",
  "next/navigation",
  "next/link",
  "next/image",
];

// Components that are NOT installed — agents must never import these
export const BLOCKED_IMPORTS: string[] = [
  "@/components/ui/calendar",
  "@/components/ui/form",
  "@/components/ui/toast",
];

/**
 * Check if an import path is allowed.
 * Returns { valid: true } or { valid: false, reason: string }.
 */
export function checkImport(importPath: string): { valid: boolean; reason?: string } {
  // Check for uppercase in @/ paths (common agent mistake)
  if (importPath.startsWith("@/")) {
    const pathAfterAt = importPath.slice(2);
    if (pathAfterAt !== pathAfterAt.toLowerCase()) {
      return {
        valid: false,
        reason: `Import path must be lowercase: "${importPath}" → "${importPath.toLowerCase()}"`,
      };
    }
  }

  // Check against blocked list first (specific error message)
  if (BLOCKED_IMPORTS.includes(importPath)) {
    return {
      valid: false,
      reason: `"${importPath}" is not installed. Use \`npx shadcn add\` to install it first, or use an alternative.`,
    };
  }

  // Check against allowlist
  const isAllowed = ALLOWED_IMPORTS.some((allowed) => {
    // Exact match
    if (importPath === allowed) return true;
    // Allow sub-paths for external packages (e.g., "next/navigation")
    if (!allowed.startsWith("@/") && importPath.startsWith(allowed + "/")) return true;
    return false;
  });

  // Allow relative imports within the project
  if (importPath.startsWith("./") || importPath.startsWith("../")) {
    return { valid: true };
  }

  if (!isAllowed) {
    return {
      valid: false,
      reason: `"${importPath}" is not in the allowed import list. Check AGENTS.md for available imports.`,
    };
  }

  return { valid: true };
}
