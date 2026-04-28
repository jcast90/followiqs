"use client";

import { resolveLandingConfig } from "@/lib/config";
import { GradientText } from "./gradient-text";
import { Target, Layers, Sparkles } from "lucide-react";

type StepsVariant = "vertical" | "horizontal" | "cards";

const stepIcons = [Target, Layers, Sparkles];

export function StepsSection({ variant = "vertical" }: { variant?: StepsVariant }) {
  const { landing } = resolveLandingConfig();
  if (!landing.steps?.length) return null;

  if (variant === "horizontal") return <StepsHorizontal steps={landing.steps} />;
  if (variant === "cards") return <StepsCards steps={landing.steps} />;
  return <StepsVertical steps={landing.steps} />;
}

type StepsProps = { steps: { title: string; desc: string }[] };

/* ─── Vertical dotted line (Warmth) ─── */
function StepsVertical({ steps }: StepsProps) {
  return (
    <section className="px-6 py-24 border-t border-brand-border">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it <GradientText>works</GradientText>
          </h2>
          <p className="mt-4 text-zinc-400">Get started in minutes, not months.</p>
        </div>

        <div className="relative">
          <div
            className="absolute left-6 top-0 bottom-0 w-px hidden sm:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, color-mix(in srgb, var(--brand-primary) 30%, transparent) 0px, color-mix(in srgb, var(--brand-primary) 30%, transparent) 4px, transparent 4px, transparent 12px)",
            }}
          />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6 sm:pl-0">
                <div
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                  }}
                >
                  {i + 1}
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-zinc-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Horizontal timeline (Precision) ─── */
function StepsHorizontal({ steps }: StepsProps) {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-bold tracking-tight mb-12">How it works</h2>

        <div className="relative">
          <div
            className="absolute top-6 left-0 right-0 h-px hidden sm:block"
            style={{
              background: "linear-gradient(90deg, var(--brand-primary), var(--brand-accent), transparent)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm border border-brand-border bg-brand-surface text-xs font-mono font-bold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  0{i + 1}
                </div>
                <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Glass cards (Momentum) ─── */
function StepsCards({ steps }: StepsProps) {
  return (
    <section className="px-6 py-20 border-t border-brand-border">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight mb-12">
          <GradientText>How it works</GradientText>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group flex flex-col items-start rounded-2xl p-6 backdrop-blur-xl transition-all hover:bg-brand-surface-card"
              style={{
                background: "var(--brand-surface-card)",
                border: "1px solid var(--brand-border-color)",
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))" }}
              >
                {i + 1}
              </div>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
