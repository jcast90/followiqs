"use client";

import { useEffect, useRef, useState } from "react";
import { resolveLandingConfig } from "@/lib/config";
import { GradientText } from "./gradient-text";

type StatsVariant = "centered" | "horizontal" | "glass";

export function StatsSection({ variant = "centered" }: { variant?: StatsVariant }) {
  const { landing } = resolveLandingConfig();
  if (!landing.painStats?.length) return null;

  if (variant === "horizontal") return <StatsHorizontal stats={landing.painStats} />;
  if (variant === "glass") return <StatsGlass stats={landing.painStats} />;
  return <StatsCentered stats={landing.painStats} />;
}

type StatsProps = { stats: { stat: string; label: string }[] };

/* ─── Centered (Warmth) ─── */
function StatsCentered({ stats }: StatsProps) {
  return (
    <section className="relative border-y border-brand-border bg-brand-surface-card">
      <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-brand-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 px-8 py-12 text-center">
            <GradientText>
              <span className="text-4xl font-bold">{item.stat}</span>
            </GradientText>
            <span className="text-sm text-zinc-400">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Horizontal monospace (Precision) ─── */
function StatsHorizontal({ stats }: StatsProps) {
  return (
    <section className="border-y border-brand-border">
      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-3">
        {stats.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-center gap-3 px-6 py-6 ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-brand-border" : ""}`}
          >
            <span className="font-mono text-2xl font-bold text-white">{item.stat}</span>
            <span className="text-xs uppercase tracking-wider text-zinc-500">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Glass cards with animated counters (Momentum) ─── */
function StatsGlass({ stats }: StatsProps) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 rounded-2xl p-8 backdrop-blur-xl transition-all hover:bg-brand-surface-input"
            style={{
              background: "var(--brand-surface-card)",
              border: "1px solid var(--brand-border-color)",
            }}
          >
            <AnimatedStat value={item.stat} />
            <span className="text-sm text-zinc-400">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="font-mono text-4xl font-bold transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <GradientText>{value}</GradientText>
    </span>
  );
}
