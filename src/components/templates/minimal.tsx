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
import { ArrowRight } from "lucide-react";

/* Minimal: whitespace-heavy, restrained. Single-column flow, narrow measure,
   no gradients, no ornament. Lets content breathe. */

function MinimalHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 pt-40 pb-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-medium text-zinc-500 mb-8">{config.name}</p>
        <h1 className="text-4xl sm:text-5xl font-medium leading-[1.15] tracking-tight text-white">
          {landing.headline}
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-zinc-400">
          {landing.subheadline}
        </p>

        {waitlistMode && !isLiveMode ? (
          <WaitlistForm className="mt-12 max-w-md" />
        ) : (
          <div className="mt-12">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 text-sm font-medium text-white border-b border-white pb-1 hover:gap-3 transition-all"
            >
              {landing.primaryCta || "Get started"}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function MinimalFeaturesRows() {
  const { landing } = resolveLandingConfig();
  const features = landing.features || [];
  if (features.length === 0) return null;

  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-2xl space-y-20">
        {features.map((f, i) => (
          <div key={i}>
            <p className="text-xs font-medium text-zinc-600 mb-3">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white mb-3">
              {f.title}
            </h3>
            <p className="text-base leading-relaxed text-zinc-400 max-w-lg">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MinimalCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-tight">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-6 text-zinc-400 leading-relaxed">{landing.finalCta.subheadline}</p>
        <div className="mt-12 flex items-center gap-8">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-2 text-sm font-medium text-white border-b border-white pb-1 hover:gap-3 transition-all"
          >
            {landing.finalCtaButton || landing.primaryCta || (isLiveMode ? "Try Free" : "Get Started")}
            <ArrowRight className="h-4 w-4" />
          </a>
          {landing.finalCta.secondaryButton && (
            <a
              href={landing.finalCta.secondaryHref || "#pricing"}
              className="text-sm font-medium text-zinc-500 hover:text-white transition-colors"
            >
              {landing.finalCta.secondaryButton}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

const MINIMAL_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <MinimalHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="centered" />,
  "features": () => <MinimalFeaturesRows />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="cards" />,
  "faq": () => <FaqSection />,
  "cta": () => <MinimalCta />,
};

const MINIMAL_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "features", "pricing", "faq", "cta",
];

export default function Minimal({ config: _config }: { config: VentureConfig }) {
  const { landing } = resolveLandingConfig();
  const sections = landing.sections ?? MINIMAL_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="default" />
      {sections.map((id) => {
        const render = MINIMAL_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Minimal] Unknown section "${id}". Valid: ${Object.keys(MINIMAL_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
