"use client";

import React from "react";
import config, { isLiveMode, resolveLandingConfig, type VentureConfig, type LandingSectionId } from "@/lib/config";
import { NavBar } from "./shared/nav";
import { FooterBar } from "./shared/footer";
import { WaitlistForm } from "./shared/waitlist-form";
import { PricingSection } from "./shared/pricing-section";
import { LogoBar } from "./shared/logo-bar";
import { StatsSection } from "./shared/stats-section";
import { StepsSection } from "./shared/steps-section";
import { ProblemSection as SharedProblemSection } from "./shared/problem-section";
import { TestimonialsSection } from "./shared/testimonials-section";
import { FaqSection } from "./shared/faq-section";
import { ArrowUpRight } from "lucide-react";

/* Bold: high-contrast editorial. Oversized display type, thick rules,
   numbered sections, magazine-like layout with strong typographic hierarchy. */

function BoldHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-32 pb-24 border-b-[3px] border-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-10">
          <span className="px-2 py-1 bg-white text-black">Issue 01</span>
          <span>—</span>
          <span>{config.name}</span>
        </div>
        <h1 className="font-bold leading-[0.9] tracking-[-0.03em] text-white text-[clamp(2.75rem,9vw,8rem)]">
          {landing.headline}
        </h1>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 items-end">
          <p className="text-xl sm:text-2xl leading-snug text-white/80 max-w-2xl">
            {landing.subheadline}
          </p>
          <div className="flex md:justify-end">
            {waitlistMode && !isLiveMode ? (
              <WaitlistForm className="w-full max-w-sm" />
            ) : (
              <a
                href="/signup"
                className="group inline-flex items-center gap-3 border-[3px] border-white px-8 py-4 text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
              >
                {landing.primaryCta || "Start"}
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function BoldFeaturesEditorial() {
  const { landing } = resolveLandingConfig();
  const features = landing.features || [];
  if (features.length === 0) return null;

  return (
    <section className="px-6 py-24 border-b-[3px] border-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline gap-6 mb-16 border-b border-white/20 pb-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">§ Capabilities</span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">The manifesto</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {features.map((f, i) => (
            <article key={i} className="group">
              <div className="flex items-baseline gap-4 mb-3">
                <span
                  className="text-6xl font-bold leading-none"
                  style={{ color: "var(--brand-primary)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-white/20" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">{f.title}</h3>
              <p className="text-base leading-relaxed text-white/70">{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BoldCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section
      className="px-6 py-24 border-b-[3px] border-white"
      style={{ background: "var(--brand-primary)" }}
    >
      <div className="mx-auto max-w-5xl text-center text-black">
        <h2 className="font-bold leading-[0.95] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto">
          {landing.finalCta.subheadline}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-3 bg-black px-8 py-4 text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black border-[3px] border-black"
          >
            {landing.finalCtaButton || landing.primaryCta || (isLiveMode ? "Try Free" : "Get Started")}
            <ArrowUpRight className="h-5 w-5" />
          </a>
          {landing.finalCta.secondaryButton && (
            <a
              href={landing.finalCta.secondaryHref || "#pricing"}
              className="inline-flex items-center gap-2 text-base font-bold uppercase tracking-wider text-black border-b-[3px] border-black pb-0.5 hover:opacity-70 transition-opacity"
            >
              {landing.finalCta.secondaryButton}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

const BOLD_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <BoldHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="grid" />,
  "features": () => <BoldFeaturesEditorial />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="table" />,
  "faq": () => <FaqSection />,
  "cta": () => <BoldCta />,
};

const BOLD_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "social-proof", "features", "stats", "testimonials", "pricing", "cta",
];

export default function Bold({ config: _config }: { config: VentureConfig }) {
  const { landing } = resolveLandingConfig();
  const sections = landing.sections ?? BOLD_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar variant="precision" />
      {sections.map((id) => {
        const render = BOLD_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Bold] Unknown section "${id}". Valid: ${Object.keys(BOLD_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
