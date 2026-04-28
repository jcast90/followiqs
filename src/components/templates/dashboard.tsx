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
import { ArrowRight, TrendingUp, Activity, BarChart3, Circle } from "lucide-react";

/* Dashboard: product-led landing. The hero IS the product — a mocked
   dashboard UI front-and-center showing live-looking metrics, panels,
   and interactive-feeling chrome. */

function MockDashboardPreview() {
  return (
    <div className="rounded-xl border border-brand-border bg-brand-surface-card overflow-hidden shadow-2xl">
      {/* App chrome */}
      <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <span className="text-xs text-zinc-500 font-medium">{config.name} · Overview</span>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Circle className="h-2 w-2 fill-green-400 text-green-400" />
          Live
        </div>
      </div>
      {/* Body: sidebar + content */}
      <div className="grid grid-cols-[160px_1fr] min-h-[320px]">
        <aside className="border-r border-brand-border bg-brand-surface p-3 space-y-1 hidden sm:block">
          {["Overview", "Projects", "Activity", "Reports", "Settings"].map((item, i) => (
            <div
              key={item}
              className={`rounded-md px-3 py-2 text-xs font-medium ${i === 0 ? "text-white" : "text-zinc-500"}`}
              style={i === 0 ? { background: "color-mix(in srgb, var(--brand-primary) 15%, transparent)" } : {}}
            >
              {item}
            </div>
          ))}
        </aside>
        <main className="p-5 space-y-4">
          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Active", value: "1,284", delta: "+12.4%", icon: Activity },
              { label: "Revenue", value: "$48.2K", delta: "+8.1%", icon: TrendingUp },
              { label: "Conversion", value: "3.8%", delta: "+0.4%", icon: BarChart3 },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-brand-border bg-brand-surface p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{kpi.label}</span>
                  <kpi.icon className="h-3 w-3 text-zinc-500" />
                </div>
                <div className="mt-1.5 text-lg font-semibold text-white">{kpi.value}</div>
                <div className="text-[10px] font-medium" style={{ color: "var(--brand-primary)" }}>{kpi.delta}</div>
              </div>
            ))}
          </div>
          {/* Chart placeholder */}
          <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-white">Weekly activity</span>
              <span className="text-[10px] text-zinc-500">Last 7 days</span>
            </div>
            <div className="flex items-end gap-2 h-24">
              {[35, 58, 42, 72, 65, 88, 76].map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, var(--brand-primary), var(--brand-accent))`,
                  opacity: 0.4 + (i / 10),
                }} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-28 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface-card px-3 py-1 text-xs font-medium text-zinc-300"
          >
            <Circle className="h-2 w-2 fill-green-400 text-green-400" />
            Now in beta
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {landing.headline}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            {landing.subheadline}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            {waitlistMode && !isLiveMode ? (
              <WaitlistForm className="w-full max-w-md" />
            ) : (
              <>
                <a
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
                  style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
                >
                  {landing.primaryCta || "Start free trial"}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-md border border-brand-border bg-brand-surface-card px-6 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:border-brand-border-hover transition-colors"
                >
                  See it in action
                </a>
              </>
            )}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 relative">
          <div
            className="pointer-events-none absolute -inset-x-8 -top-8 -bottom-8 blur-3xl opacity-30"
            style={{ background: "linear-gradient(to bottom right, var(--brand-primary), var(--brand-accent))" }}
          />
          <div className="relative">
            <MockDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardFeaturesGrid() {
  const { landing } = resolveLandingConfig();
  const features = landing.features || [];
  if (features.length === 0) return null;

  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Everything in one place
          </h2>
          <p className="mt-3 text-zinc-400">
            Built to replace the patchwork of tools your team uses today.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-lg border border-brand-border bg-brand-surface-card p-6 hover:border-brand-border-hover transition-colors"
            >
              <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md text-lg"
                style={{
                  background: "color-mix(in srgb, var(--brand-primary) 15%, transparent)",
                  color: "var(--brand-primary)",
                }}
              >
                {f.icon || "●"}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-2xl border border-brand-border bg-brand-surface-card p-10 sm:p-14 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">{landing.finalCta.subheadline}</p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
          >
            {landing.finalCtaButton || landing.primaryCta || (isLiveMode ? "Try Free" : "Get Started")}
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

const DASHBOARD_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <DashboardHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="grid" />,
  "features": () => <DashboardFeaturesGrid />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="cards" />,
  "faq": () => <FaqSection />,
  "cta": () => <DashboardCta />,
};

const DASHBOARD_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "social-proof", "features", "stats", "testimonials", "pricing", "cta",
];

export default function Dashboard({ config: _config }: { config: VentureConfig }) {
  const { landing } = resolveLandingConfig();
  const sections = landing.sections ?? DASHBOARD_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="default" />
      {sections.map((id) => {
        const render = DASHBOARD_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Dashboard] Unknown section "${id}". Valid: ${Object.keys(DASHBOARD_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
