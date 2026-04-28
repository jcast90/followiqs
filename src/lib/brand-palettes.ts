/**
 * Pre-defined brand palettes for auto-generated ventures.
 * The build orchestrator picks one based on the product vertical
 * or generates a custom one via the design agent.
 */

export const PALETTES = {
  ocean: {
    primary: "#0ea5e9",
    primaryDark: "#0284c7",
    accent: "#6366f1",
    gradient: "from-sky-500 to-indigo-500",
    gradientHover: "from-sky-400 to-indigo-400",
    borderRadius: "rounded" as const,
    gradientAngle: 135,
    borderOpacity: 0.06,
  },
  emerald: {
    primary: "#10b981",
    primaryDark: "#059669",
    accent: "#06b6d4",
    gradient: "from-emerald-500 to-cyan-500",
    gradientHover: "from-emerald-400 to-cyan-400",
    borderRadius: "rounded" as const,
    gradientAngle: 150,
    borderOpacity: 0.06,
  },
  sunset: {
    primary: "#f97316",
    primaryDark: "#ea580c",
    accent: "#ef4444",
    gradient: "from-orange-500 to-red-500",
    gradientHover: "from-orange-400 to-red-400",
    borderRadius: "pill" as const,
    gradientAngle: 120,
    borderOpacity: 0.08,
  },
  violet: {
    primary: "#8b5cf6",
    primaryDark: "#7c3aed",
    accent: "#ec4899",
    gradient: "from-violet-500 to-pink-500",
    gradientHover: "from-violet-400 to-pink-400",
    borderRadius: "rounded" as const,
    gradientAngle: 135,
    borderOpacity: 0.06,
  },
  midnight: {
    primary: "#3b82f6",
    primaryDark: "#2563eb",
    accent: "#8b5cf6",
    gradient: "from-blue-600 to-violet-600",
    gradientHover: "from-blue-500 to-violet-500",
    borderRadius: "rounded" as const,
    gradientAngle: 135,
    borderOpacity: 0.06,
  },
  coral: {
    primary: "#f43f5e",
    primaryDark: "#e11d48",
    accent: "#fb923c",
    gradient: "from-rose-500 to-orange-400",
    gradientHover: "from-rose-400 to-orange-300",
    borderRadius: "pill" as const,
    gradientAngle: 90,
    borderOpacity: 0.07,
  },
  forest: {
    primary: "#22c55e",
    primaryDark: "#16a34a",
    accent: "#84cc16",
    gradient: "from-green-500 to-lime-500",
    gradientHover: "from-green-400 to-lime-400",
    borderRadius: "sharp" as const,
    gradientAngle: 180,
    borderOpacity: 0.05,
  },
  arctic: {
    primary: "#06b6d4",
    primaryDark: "#0891b2",
    accent: "#3b82f6",
    gradient: "from-cyan-500 to-blue-500",
    gradientHover: "from-cyan-400 to-blue-400",
    borderRadius: "sharp" as const,
    gradientAngle: 45,
    borderOpacity: 0.05,
  },
} as const;

export type PaletteName = keyof typeof PALETTES;

/**
 * Pick a palette based on product name hash for consistent but varied branding.
 */
export function pickPalette(productName: string): PaletteName {
  const names = Object.keys(PALETTES) as PaletteName[];
  let hash = 0;
  for (let i = 0; i < productName.length; i++) {
    hash = ((hash << 5) - hash + productName.charCodeAt(i)) | 0;
  }
  return names[Math.abs(hash) % names.length];
}

/**
 * Typography profiles with vertical metadata, used by the config-builder
 * agent to pick a typography style for a new venture. The runtime
 * rendering config lives in `./typography.ts` (TYPOGRAPHY_PRESETS); this
 * map is the agent-facing selector metadata.
 */
export const TYPOGRAPHY_PROFILES = {
  clean: {
    body: "Inter",
    display: "Inter",
    verticals: ["saas", "productivity", "analytics", "general"],
    description: "Clean, modern sans-serif. Good for most SaaS products.",
  },
  editorial: {
    body: "Inter",
    display: "Playfair Display",
    verticals: ["media", "content", "blog", "marketing"],
    description: "Elegant serif display with readable body. Good for content-heavy products.",
  },
  technical: {
    body: "Inter",
    display: "JetBrains Mono",
    verticals: ["devtools", "api", "infrastructure", "data"],
    description: "Monospace display with sans body. Great for developer tools and technical products.",
  },
  friendly: {
    body: "DM Sans",
    display: "DM Sans",
    verticals: ["consumer", "health", "education", "community"],
    description: "Approachable, rounded sans-serif. Good for consumer and B2C products.",
  },
} as const;

export type TypographyProfileName = keyof typeof TYPOGRAPHY_PROFILES;

/**
 * Density levels for spacing configuration. Runtime scales live in
 * `./typography.ts` (DENSITY_SCALES); this map is agent-facing metadata.
 */
export const DENSITY_LEVELS = {
  compact: "Tighter spacing. Good for data-dense dashboards and power users.",
  default: "Balanced spacing. Good for most products.",
  spacious: "Generous whitespace. Good for marketing-focused products.",
} as const;

export type DensityLevelName = keyof typeof DENSITY_LEVELS;

/**
 * Suggest a typography profile based on product vertical string.
 */
export function suggestTypography(vertical: string): TypographyProfileName {
  const lower = vertical.toLowerCase();
  for (const [name, profile] of Object.entries(TYPOGRAPHY_PROFILES)) {
    if (profile.verticals.some((v) => lower.includes(v))) {
      return name as TypographyProfileName;
    }
  }
  return "clean";
}
