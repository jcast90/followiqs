Dark theme only. Brand colors set via CSS variables in venture.config.json.

## CSS Variables (injected by BrandProvider)
--brand-primary, --brand-primary-dark, --brand-accent
--brand-surface (page bg), --brand-surface-light (cards), --brand-surface-card, --brand-surface-input
--brand-radius (card/button radius), --brand-gradient-angle, --brand-border-opacity
--brand-border-color (computed rgba from borderOpacity)

## Usage
Background: bg-brand-surface (page), bg-brand-surface-light (cards)
Text: text-white / text-white/60 (secondary) / text-white/40 (muted)
Borders: style={{ borderColor: "var(--brand-border-color)" }} or border-white/[0.06] for Tailwind shorthand
Cards: style={{ borderColor: "var(--brand-border-color)", background: "var(--brand-surface-card)" }}
Inputs: style={{ background: "var(--brand-surface-input)" }}
Gradient buttons: style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
Border radius: style={{ borderRadius: "var(--brand-radius)" }}
Page wrapper: <div className="px-4 py-8 lg:px-8">
Title: text-2xl font-bold tracking-tight text-white
Table headers: text-white/40, rows: border-white/[0.06] hover:bg-white/[0.03]
Outline buttons: variant="outline" className="border-white/[0.06] text-white hover:bg-white/[0.06]"

## Brand Config Fields
borderRadius: "sharp" (0.25rem) | "rounded" (0.75rem) | "pill" (9999px)
gradientAngle: number (degrees, e.g. 135)
borderOpacity: number (e.g. 0.06)
surfaceCard: hex color for card backgrounds
surfaceInput: hex color for input backgrounds
