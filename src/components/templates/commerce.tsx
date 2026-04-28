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
import { ArrowRight, ShoppingBag, Star, Truck } from "lucide-react";

/* Commerce: e-commerce / DTC. Large lifestyle hero, collection grid,
   review stars, generous product-frame treatment. */

function CommerceHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-24 pb-16">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase text-white/80"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Star className="h-3 w-3" style={{ color: "var(--brand-primary)" }} fill="currentColor" />
            New collection
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-white">
            {landing.headline}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/70">{landing.subheadline}</p>

          <div className="mt-8">
            {waitlistMode && !isLiveMode ? (
              <WaitlistForm className="max-w-md" />
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
                  style={{ background: "var(--brand-primary)" }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {landing.primaryCta || "Shop now"}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#features" className="text-sm font-medium text-white/80 hover:text-white underline underline-offset-4">
                  Browse the collection
                </a>
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4" />
              Free shipping over $75
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4" style={{ color: "var(--brand-primary)" }} fill="currentColor" />
              4.9 · 2,400+ reviews
            </span>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))",
          }}
        >
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 55%)",
            }}
          />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl p-4 backdrop-blur-md"
            style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <p className="text-xs font-medium text-white/70 uppercase tracking-wide">Best seller</p>
            <p className="mt-1 text-base font-semibold text-white">{config.name} Essentials</p>
            <div className="mt-2 flex items-center gap-1">
              {[0,1,2,3,4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 text-white" fill="currentColor" />
              ))}
              <span className="ml-2 text-xs text-white/70">4.9 (1.2k)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommerceCollection() {
  const { landing } = resolveLandingConfig();
  const features = landing.features || [];
  if (features.length === 0) return null;

  const gradients = [
    "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))",
    "linear-gradient(135deg, var(--brand-accent), var(--brand-primary))",
    "linear-gradient(135deg, #f59e0b, #ef4444)",
    "linear-gradient(135deg, #6366f1, #8b5cf6)",
    "linear-gradient(135deg, #10b981, #06b6d4)",
    "linear-gradient(135deg, #ec4899, #f43f5e)",
  ];

  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Shop the collection
          </h2>
          <a href="/shop" className="text-sm font-medium text-white/70 hover:text-white inline-flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="group cursor-pointer">
              <div
                className="aspect-square w-full rounded-2xl mb-3 relative overflow-hidden"
                style={{ background: gradients[i % gradients.length] }}
              >
                <div className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ background: "rgba(0,0,0,0.4)", color: "white" }}
                >
                  {i === 0 ? "New" : i === 1 ? "Best seller" : "Limited"}
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40">
                  {f.icon || "◆"}
                </div>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-white/50 line-clamp-1 mt-0.5">{f.description}</p>
                </div>
                <p className="text-sm font-semibold text-white whitespace-nowrap">
                  ${(39 + i * 10).toFixed(0)}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-0.5">
                {[0,1,2,3,4].map((s) => (
                  <Star key={s} className="h-3 w-3" style={{ color: "var(--brand-primary)" }} fill="currentColor" />
                ))}
                <span className="ml-1.5 text-[10px] text-white/50">({100 + i * 47})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommerceCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-24">
      <div
        className="mx-auto max-w-5xl rounded-3xl px-8 py-16 text-center"
        style={{
          background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))",
        }}
      >
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-4 text-white/90 max-w-2xl mx-auto">{landing.finalCta.subheadline}</p>
        <div className="mt-10">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/shop"}
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black"
          >
            <ShoppingBag className="h-4 w-4" />
            {landing.finalCtaButton || landing.primaryCta || "Shop now"}
          </a>
        </div>
      </div>
    </section>
  );
}

const COMMERCE_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <CommerceHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="centered" />,
  "features": () => <CommerceCollection />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="cards" />,
  "faq": () => <FaqSection />,
  "cta": () => <CommerceCta />,
};

const COMMERCE_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "features", "testimonials", "faq", "cta",
];

export default function Commerce({ config: _config }: { config: VentureConfig }) {
  const { landing } = resolveLandingConfig();
  const sections = landing.sections ?? COMMERCE_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="default" />
      {sections.map((id) => {
        const render = COMMERCE_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Commerce] Unknown section "${id}". Valid: ${Object.keys(COMMERCE_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
