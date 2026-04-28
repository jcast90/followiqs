import { Inter, Playfair_Display, JetBrains_Mono, DM_Sans } from "next/font/google";

// Load all font candidates at module scope so next/font can optimize them.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export type TypographyPreset = "clean" | "editorial" | "technical" | "friendly";

export type TypographyPresetConfig = {
  /** Space-separated className list combining all next/font variables used. */
  variableClassName: string;
  /** CSS value for --font-sans (body). */
  sansStack: string;
  /** CSS value for --font-display (headings). */
  displayStack: string;
  /** CSS value for --font-mono (code). */
  monoStack: string;
};

const FALLBACK_SANS = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
const FALLBACK_SERIF = `Georgia, Cambria, "Times New Roman", Times, serif`;
const FALLBACK_MONO = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;

export const TYPOGRAPHY_PRESETS: Record<TypographyPreset, TypographyPresetConfig> = {
  clean: {
    variableClassName: `${inter.variable} ${jetbrainsMono.variable}`,
    sansStack: `var(--font-inter), ${FALLBACK_SANS}`,
    displayStack: `var(--font-inter), ${FALLBACK_SANS}`,
    monoStack: `var(--font-mono), ${FALLBACK_MONO}`,
  },
  editorial: {
    variableClassName: `${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`,
    sansStack: `var(--font-inter), ${FALLBACK_SANS}`,
    displayStack: `var(--font-playfair), ${FALLBACK_SERIF}`,
    monoStack: `var(--font-mono), ${FALLBACK_MONO}`,
  },
  technical: {
    variableClassName: `${inter.variable} ${jetbrainsMono.variable}`,
    sansStack: `var(--font-inter), ${FALLBACK_SANS}`,
    displayStack: `var(--font-mono), ${FALLBACK_MONO}`,
    monoStack: `var(--font-mono), ${FALLBACK_MONO}`,
  },
  friendly: {
    variableClassName: `${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable}`,
    sansStack: `var(--font-dm-sans), ${FALLBACK_SANS}`,
    displayStack: `var(--font-dm-sans), ${FALLBACK_SANS}`,
    monoStack: `var(--font-mono), ${FALLBACK_MONO}`,
  },
};

export function resolveTypographyPreset(preset?: string | null): TypographyPresetConfig {
  const key = (preset ?? "clean") as TypographyPreset;
  return TYPOGRAPHY_PRESETS[key] ?? TYPOGRAPHY_PRESETS.clean;
}

export type Density = "compact" | "default" | "spacious";

export type DensityScale = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  /** Base line-height multiplier */
  lineHeight: string;
  /** Base font size for body text */
  fontSize: string;
};

export const DENSITY_SCALES: Record<Density, DensityScale> = {
  compact: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    lineHeight: "1.4",
    fontSize: "0.9375rem",
  },
  default: {
    xs: "0.375rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    lineHeight: "1.5",
    fontSize: "1rem",
  },
  spacious: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4.5rem",
    lineHeight: "1.65",
    fontSize: "1.0625rem",
  },
};

export function resolveDensity(density?: string | null): DensityScale {
  const key = (density ?? "default") as Density;
  return DENSITY_SCALES[key] ?? DENSITY_SCALES.default;
}
