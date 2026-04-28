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
import { ArrowRight, Terminal, BookOpen, Code2 } from "lucide-react";

/* Clarity: docs / dev-tool inspired. Sidebar-adjacent hero, monospace accents,
   clean line-art cards, muted palette with gradient-free accents. */

function ClarityHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-32 pb-20">
      {/* Horizontal rule grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "100% 32px",
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6">
          <span className="h-px w-8 bg-brand-primary" />
          <Terminal className="h-3.5 w-3.5" style={{ color: "var(--brand-primary)" }} />
          <span>documentation-grade clarity</span>
        </div>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl max-w-3xl">
          {landing.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          {landing.subheadline}
        </p>

        {waitlistMode && !isLiveMode ? (
          <WaitlistForm className="mt-10 max-w-md" />
        ) : (
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "var(--brand-primary)" }}
            >
              {landing.primaryCta || "Get started"}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-md border border-brand-border px-5 py-3 text-sm font-medium text-zinc-300 hover:border-brand-border-hover hover:text-white transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Read the docs
            </a>
          </div>
        )}

        {/* Code snippet preview */}
        <div className="mt-14 rounded-lg border border-brand-border bg-brand-surface-card overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 border-b border-brand-border px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="ml-3 text-xs font-mono text-zinc-500">~/project $ {config.name.toLowerCase()}</span>
          </div>
          <pre className="overflow-x-auto px-5 py-4 text-xs leading-relaxed font-mono text-zinc-300">
            <code>
              <span className="text-zinc-500"># install</span>{"\n"}
              <span style={{ color: "var(--brand-primary)" }}>$</span> npm install {config.name.toLowerCase().replace(/\s+/g, "-")}{"\n\n"}
              <span className="text-zinc-500"># import and use</span>{"\n"}
              <span style={{ color: "var(--brand-accent)" }}>import</span> {"{ "}client{" }"} <span style={{ color: "var(--brand-accent)" }}>from</span> <span style={{ color: "var(--brand-primary)" }}>&quot;{config.name.toLowerCase().replace(/\s+/g, "-")}&quot;</span>;{"\n\n"}
              <span style={{ color: "var(--brand-accent)" }}>await</span> client.run({"{ "}ready: <span style={{ color: "var(--brand-primary)" }}>true</span> {"}"});
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function ClarityFeaturesList() {
  const { landing } = resolveLandingConfig();
  const features = landing.features || [];
  if (features.length === 0) return null;

  return (
    <section id="features" className="px-6 py-20 border-t border-brand-border">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Reference</p>
            <h2 className="text-3xl font-bold tracking-tight">What you get</h2>
          </div>
          <Code2 className="h-6 w-6 text-zinc-600" />
        </div>
        <div className="divide-y divide-brand-border border border-brand-border rounded-lg overflow-hidden bg-brand-surface-card">
          {features.map((f, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 p-6 hover:bg-brand-surface transition-colors">
              <div className="font-mono text-xs uppercase tracking-wider text-zinc-500 pt-1">
                {String(i + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1">{f.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClarityCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-20 border-t border-brand-border">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">
          $ begin
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-4 text-zinc-400">{landing.finalCta.subheadline}</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-primary)" }}
          >
            {landing.finalCtaButton || landing.primaryCta || (isLiveMode ? "Try it Free" : "Get Started")}
            <ArrowRight className="h-4 w-4" />
          </a>
          {landing.finalCta.secondaryButton && (
            <a
              href={landing.finalCta.secondaryHref || "#pricing"}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {landing.finalCta.secondaryButton} →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

const CLARITY_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <ClarityHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="grid" />,
  "features": () => <ClarityFeaturesList />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="table" />,
  "faq": () => <FaqSection />,
  "cta": () => <ClarityCta />,
};

const CLARITY_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "social-proof", "features", "steps", "pricing", "faq", "cta",
];

export default function Clarity({ config: _config }: { config: VentureConfig }) {
  const { landing } = resolveLandingConfig();
  const sections = landing.sections ?? CLARITY_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="precision" />
      {sections.map((id) => {
        const render = CLARITY_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Clarity] Unknown section "${id}". Valid: ${Object.keys(CLARITY_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
