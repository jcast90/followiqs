# Venture Template — Roadmap

Audit completed 2026-04-08. Tickets ordered by priority (impact vs effort).

---

## VT-1: Dynamic pricing grid
**Status:** done
**Impact:** High | **Effort:** Low

All three pricing variants hardcode `sm:grid-cols-3`. If a venture has 2 tiers, cards stretch awkwardly. If 4, they overflow.

- Read `landing.pricing.length` and adapt grid columns
- 2 tiers: center with max-width cap (~380px per card)
- 3 tiers: standard 3-col (current, correct)
- 4 tiers: 2x2 or compact 4-col row
- Apply to all three variants (cards, table, glass)

---

## VT-2: Per-tier CTA copy
**Status:** done
**Impact:** High | **Effort:** Low

Currently all pricing CTAs say "Get Started". Research shows ~22% CTR lift from contextual copy ("Start Free" / "Start Trial" / "Contact Sales").

- Add optional `cta` field to each pricing tier in config schema
- Wire into all three pricing variants
- Fallback to "Get Started" if not provided

---

## VT-3: Configurable sections array
**Status:** done
**Impact:** High | **Effort:** Medium

LLMs assemble pages more reliably when they can declare which sections to render and in what order via config rather than inferring from template code.

- Add `landing.sections` array to config: `["hero", "social-proof", "stats", "problem", "features", "steps", "testimonials", "pricing", "faq", "cta"]`
- Templates render sections in config order, skip unlisted ones
- Each section gracefully handles missing data (some already do, make consistent)

---

## VT-4: Brand differentiation tokens
**Status:** done
**Impact:** High | **Effort:** Medium

Two ventures using the same palette look identical. Need more differentiation levers beyond just swapping primary/accent hue.

- Add to `brand` config: `borderRadius` ("sharp" | "rounded" | "pill"), `gradientAngle` (number), `borderOpacity` (number)
- Wire into CSS vars via BrandProvider
- Templates read these tokens instead of hardcoding `rounded-2xl`, `to right`, `border-white/[0.06]`
- Two products with same hue but different radius + gradient direction read as different brands

---

## VT-5: Logo bar component
**Status:** done
**Impact:** Medium | **Effort:** Medium

Logo bars are the #2 trust signal by conversion impact. Currently absent from all templates.

- Add `socialProof.logos` array to config (image paths + alt text)
- Build shared `LogoBar` component with variant styling
- Place below hero / above stats in all templates
- Support 5-8 logos with grayscale + hover color treatment

---

## VT-6: Shared section components
**Status:** done
**Impact:** Medium | **Effort:** High

Steps, stats, problem, testimonials, FAQ are reimplemented per-template (or missing entirely from Precision). Pricing already follows the shared-with-variant pattern.

- Refactor into shared components: `StatsSection`, `StepsSection`, `ProblemSection`, `TestimonialsSection`, `FaqSection`
- Each accepts a `variant` prop matching the template style
- All templates get access to all sections (Precision currently missing features, testimonials, FAQ)
- Reduces duplication, ensures feature parity across templates

---

## VT-7: Billing toggle on pricing
**Status:** done
**Impact:** Medium | **Effort:** Medium

Annual default improves adoption 25-35%. Currently no toggle exists.

- Add to config: `pricingToggle: { enabled, default, annualDiscount }`
- Each pricing tier gets `monthlyPrice` and `annualPrice` fields
- Build toggle component, wire into all pricing variants
- Default to annual, show savings badge

---

## VT-8: Secondary CTA on final section
**Status:** done
**Impact:** Low-Medium | **Effort:** Low

Every primary CTA should pair with a lower-commitment secondary ("or book a 15-min demo") to capture buyers not ready to self-serve.

- Add `finalCta.secondaryButton` and `finalCta.secondaryHref` to config
- Render below primary CTA in all templates
- Style as text link or ghost button

---

## VT-9: Surface/border design tokens
**Status:** done
**Impact:** Medium | **Effort:** Medium

Hardcoded values like `border-white/[0.06]`, `bg-white/[0.02]`, `bg-white/[0.04]` are scattered across all templates and blocks. Should be config-driven tokens.

- Add semantic tokens to brand config: `--border-subtle`, `--surface-card`, `--surface-input`
- Wire through BrandProvider as CSS vars
- Replace hardcoded values across templates and blocks
- Enables ventures to tune surface depth and border visibility
