"use client";

import { resolveLandingConfig } from "@/lib/config";
import { GradientText } from "./gradient-text";

type ProblemVariant = "centered" | "grid";

const painIcons = ["→", "⚡", "↗", "⬡", "◆", "▲"];

export function ProblemSection({ variant = "centered" }: { variant?: ProblemVariant }) {
  const { landing } = resolveLandingConfig();
  if (!landing.painPoints?.length) return null;

  if (variant === "grid") return <ProblemGrid painPoints={landing.painPoints} />;
  return <ProblemCentered painPoints={landing.painPoints} />;
}

type ProblemProps = { painPoints: string[] };

/* ─── Centered text (Warmth) ─── */
function ProblemCentered({ painPoints }: ProblemProps) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          The problem with <GradientText>today</GradientText>
        </h2>
        <div className="mx-auto mt-8 max-w-2xl space-y-4">
          {painPoints.map((point, i) => (
            <p key={i} className="text-lg leading-relaxed text-zinc-400">{point}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 2-col compact grid (Precision) ─── */
function ProblemGrid({ painPoints }: ProblemProps) {
  return (
    <section className="px-6 py-16 border-t border-brand-border">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-bold tracking-tight mb-8">Problems we solve</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-sm border border-brand-border bg-brand-surface-card p-4 transition-colors hover:border-brand-border"
            >
              <span className="font-mono text-xs text-brand-primary mt-0.5">
                {painIcons[i % painIcons.length]}
              </span>
              <p className="text-sm leading-relaxed text-zinc-400">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
