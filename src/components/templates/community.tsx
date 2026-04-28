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
import { ArrowRight, MessageCircle, Users, Sparkles } from "lucide-react";

/* Community: social/membership products. Avatar cluster, activity feed mock,
   conversational tone, rounded shapes. */

const AVATAR_COLORS = [
  "linear-gradient(135deg, #f472b6, #f59e0b)",
  "linear-gradient(135deg, #60a5fa, #a78bfa)",
  "linear-gradient(135deg, #34d399, #10b981)",
  "linear-gradient(135deg, #fb7185, #f43f5e)",
  "linear-gradient(135deg, #fbbf24, #f97316)",
  "linear-gradient(135deg, #a78bfa, #ec4899)",
];

function AvatarCluster() {
  return (
    <div className="flex -space-x-2">
      {AVATAR_COLORS.map((bg, i) => (
        <div
          key={i}
          className="h-9 w-9 rounded-full border-2 border-[var(--brand-surface,#0b0b0c)] shadow-sm"
          style={{ background: bg }}
        />
      ))}
      <div
        className="h-9 w-9 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold text-white"
        style={{
          borderColor: "var(--brand-surface, #0b0b0c)",
          background: "rgba(255,255,255,0.12)",
        }}
      >
        +2k
      </div>
    </div>
  );
}

function CommunityHero() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="relative px-6 pt-28 pb-20 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[30rem] w-[50rem] rounded-full blur-3xl opacity-25"
        style={{ background: "var(--brand-primary)" }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-3 rounded-full px-4 py-1.5"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <AvatarCluster />
          <span className="text-xs font-medium text-white/80">Join the community</span>
        </div>
        <h1 className="mt-8 text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-white">
          {landing.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          {landing.subheadline}
        </p>

        <div className="mt-10">
          {waitlistMode && !isLiveMode ? (
            <WaitlistForm className="mx-auto max-w-md" />
          ) : (
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
              style={{ background: "var(--brand-primary)" }}
            >
              {landing.primaryCta || "Join the community"}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function CommunityActivityFeed() {
  const { landing } = resolveLandingConfig();
  const features = landing.features || [];
  if (features.length === 0) return null;

  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <MessageCircle className="mx-auto h-6 w-6 mb-4" style={{ color: "var(--brand-primary)" }} />
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            What&apos;s happening inside
          </h2>
          <p className="mt-3 text-white/70">Real conversations, real help, real momentum.</p>
        </div>

        <div className="space-y-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="h-10 w-10 shrink-0 rounded-full"
                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <span className="text-xs text-white/40">·</span>
                  <span className="text-xs text-white/40">
                    {i === 0 ? "just now" : i === 1 ? "2m ago" : `${i * 4}h ago`}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/70">{f.description}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> {12 + i * 3}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> {24 + i * 7}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityCta() {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;

  return (
    <section className="px-6 py-24">
      <div
        className="mx-auto max-w-4xl rounded-[2rem] px-8 py-16 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="mb-6 flex justify-center">
          <AvatarCluster />
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
          {landing.finalCta.headline}
        </h2>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">{landing.finalCta.subheadline}</p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <a
            href={waitlistMode && !isLiveMode ? "#waitlist" : "/signup"}
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white"
            style={{ background: "var(--brand-primary)" }}
          >
            <Users className="h-4 w-4" />
            {landing.finalCtaButton || landing.primaryCta || "Join the community"}
          </a>
          {landing.finalCta.secondaryButton && (
            <a
              href={landing.finalCta.secondaryHref || "#pricing"}
              className="text-sm font-medium text-white/70 hover:text-white"
            >
              {landing.finalCta.secondaryButton}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

const COMMUNITY_SECTIONS: Record<LandingSectionId, () => React.ReactNode> = {
  "hero": () => <CommunityHero />,
  "social-proof": () => <LogoBar />,
  "stats": () => <StatsSection variant="horizontal" />,
  "problem": () => <SharedProblemSection variant="centered" />,
  "features": () => <CommunityActivityFeed />,
  "steps": () => <StepsSection variant="horizontal" />,
  "testimonials": () => <TestimonialsSection />,
  "pricing": () => <PricingSection variant="cards" />,
  "faq": () => <FaqSection />,
  "cta": () => <CommunityCta />,
};

const COMMUNITY_DEFAULT_SECTIONS: LandingSectionId[] = [
  "hero", "stats", "features", "testimonials", "pricing", "faq", "cta",
];

export default function Community({ config: _config }: { config: VentureConfig }) {
  const { landing } = resolveLandingConfig();
  const sections = landing.sections ?? COMMUNITY_DEFAULT_SECTIONS;

  return (
    <div className="min-h-screen bg-brand-surface text-white">
      <NavBar variant="momentum" />
      {sections.map((id) => {
        const render = COMMUNITY_SECTIONS[id];
        if (!render) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Community] Unknown section "${id}". Valid: ${Object.keys(COMMUNITY_SECTIONS).join(", ")}`);
          }
          return null;
        }
        return <React.Fragment key={id}>{render()}</React.Fragment>;
      })}
      <FooterBar />
    </div>
  );
}
