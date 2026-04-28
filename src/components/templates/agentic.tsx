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
import { ArrowRight, Sparkles, Terminal, Cpu, Check } from "lucide-react";

/* Agentic: AI-first products. Chat/terminal preview, "show your work" feel,
   model badges, step traces. */

function AgenticChatPreview() {
  const { landing } = resolveLandingConfig();
  const sample = (landing.features?.[0]?.title || landing.headline || "Analyze this for me").slice(0, 80);
  return (
    <div
      className="mx-auto mt-14 w-full max-w-2xl rounded-2xl overflow-hidden text-left font-mono text-sm shadow-2xl"
      style={{
        background: "rgba(10,10,12,0.8)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-xs text-white/40">agent · running</span>
      </div>
      <div className="p-5 space-y-3.5 text-xs sm:text-[13px] leading-relaxed">
        <div className="flex gap-2">
          <span className="text-white/40 shrink-0">user</span>
          <span className="text-white/90">{sample}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0" style={{ color: "var(--brand-primary)" }}>agent</span>
          <span className="text-white/70">
            <span className="inline-flex items-center gap-1.5 text-white/50">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--brand-primary)" }} />
              thinking
            </span>
          </span>
        </div>
        <div className="pl-10 space-y-1.5 text-white/50 text-[11px]">
          <div className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-400" /> parsed request</div>
          <div className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-400" /> queried data</div>
          <div className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-400" /> ran 3 tools</div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-white/30 animate-spin border-t-white/80" />
            composing answer
          </div>
        </div>
      </div>
    </div>
  );
}

function AgenticHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-24 pb-16 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono text-white/70"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Sparkles className="h-3 w-3" style={{ color: "var(--brand-primary)" }} />
          AI agent · {config.name}
        </span>
        <h1 className="mt-6 text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-white">
          {landing.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          {landing.subheadline}
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/40 font-mono flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1" style={{ background: "rgba(255,255,255,0.04)" }}>
            <Cpu className="h-3 w-3" /> claude · gpt-4 · local
          </span>
          <span>·</span>
          <span>autonomous</span>
          <span>·</span>
          <span>observable</span>
        </div>

        <div className="mt-10">
          {waitlistMode && !isLiveMode ? (
            <WaitlistForm className="mx-auto max-w-md" />
          ) : (
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              <Terminal className="h-4 w-4" />
              {landing.primaryCta || "Try the agent"}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>

        <AgenticChatPreview />
      </div>
    </section>
  );
}

function AgenticCapabilities() {
  const { landing } = resolveLandingConfig();
  const features = landing.features || [];
  if (features.length === 0) return null;

  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-mono text-white/50 mb-3">// capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            What the agent can do
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6"
              style={{ background: "var(--brand-surface, #0b0b0c)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ background: "var(--brand-primary)" }}
                />
                <span className="text-xs font-mono text-white/60">tool</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgenticCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">{landing.finalCta.subheadline}</p>
        <div className="mt-10">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--brand-primary)" }}
          >
            <Terminal className="h-4 w-4" />
            {landing.finalCtaButton || landing.primaryCta || "Run the agent"}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

const AGENTIC_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <AgenticHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="centered" />,
  "features": () => <AgenticCapabilities />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="table" />,
  "faq": () => <FaqSection />,
  "cta": () => <AgenticCta />,
};

const AGENTIC_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "features", "steps", "pricing", "faq", "cta",
];

export default function Agentic({ config: _config }: { config: VentureConfig }) {
  const { landing } = resolveLandingConfig();
  const sections = landing.sections ?? AGENTIC_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="default" />
      {sections.map((id) => {
        const render = AGENTIC_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Agentic] Unknown section "${id}". Valid: ${Object.keys(AGENTIC_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
