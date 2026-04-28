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
import { ArrowRight, Sparkles, Heart, Leaf } from "lucide-react";

/* Organic: soft, rounded, warm. Blob backgrounds, generous padding,
   serif/display headline with rounded sans body, pastel accents. */

function OrganicHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-32 pb-24 overflow-hidden">
      {/* Soft blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-20 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-40"
        style={{ background: "var(--brand-primary)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-20 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-30"
        style={{ background: "var(--brand-accent)" }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--brand-primary)" }} />
          A kinder way to work
        </span>
        <h1 className="mt-8 text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-white">
          {landing.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          {landing.subheadline}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          {waitlistMode && !isLiveMode ? (
            <WaitlistForm className="w-full max-w-md" />
          ) : (
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg shadow-black/30 transition-transform hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))" }}
            >
              {landing.primaryCta || "Start free"}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
          <p className="text-xs text-white/50 flex items-center gap-1.5">
            <Heart className="h-3 w-3" style={{ color: "var(--brand-primary)" }} />
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}

function OrganicFeaturesCards() {
  const { landing } = resolveLandingConfig();
  const features = landing.features || [];
  if (features.length === 0) return null;

  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Leaf className="mx-auto h-6 w-6 mb-4" style={{ color: "var(--brand-primary)" }} />
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Designed with care
          </h2>
          <p className="mt-4 text-white/70">
            Every feature is thoughtfully crafted to feel natural, not mechanical.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-3xl p-8 transition-all hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
                style={{
                  background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 30%, transparent), color-mix(in srgb, var(--brand-accent) 30%, transparent))",
                }}
              >
                {f.icon || "✦"}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrganicCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-24">
      <div
        className="relative mx-auto max-w-5xl rounded-[2.5rem] px-8 py-20 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))" }}
      >
        <div className="pointer-events-none absolute -top-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
            {landing.finalCta.headline}
          </h2>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto">
            {landing.finalCta.subheadline}
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <a
              href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-transform hover:scale-[1.03] shadow-lg shadow-black/20"
            >
              {landing.finalCtaButton || landing.primaryCta || (isLiveMode ? "Try Free" : "Get Started")}
              <ArrowRight className="h-4 w-4" />
            </a>
            {landing.finalCta.secondaryButton && (
              <a
                href={landing.finalCta.secondaryHref || "#pricing"}
                className="text-sm font-medium text-white/90 underline underline-offset-4 hover:text-white"
              >
                {landing.finalCta.secondaryButton}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const ORGANIC_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <OrganicHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="centered" />,
  "features": () => <OrganicFeaturesCards />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="cards" />,
  "faq": () => <FaqSection />,
  "cta": () => <OrganicCta />,
};

const ORGANIC_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "social-proof", "problem", "features", "testimonials", "pricing", "faq", "cta",
];

export default function Organic({ config: _config }: { config: VentureConfig }) {
  const { landing } = resolveLandingConfig();
  const sections = landing.sections ?? ORGANIC_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="momentum" />
      {sections.map((id) => {
        const render = ORGANIC_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Organic] Unknown section "${id}". Valid: ${Object.keys(ORGANIC_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
