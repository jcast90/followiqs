"use client";

import { resolveLandingConfig } from "@/lib/config";
import { GradientText } from "./gradient-text";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  const { landing } = resolveLandingConfig();
  const testimonials = landing.testimonials;
  if (!testimonials?.length) return null;

  return (
    <section className="py-24 border-t border-brand-border">
      <div className="px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl mb-16">
            What people are <GradientText>saying</GradientText>
          </h2>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 pb-4 scrollbar-hide">
        <div className="shrink-0 w-[calc((100%-theme(maxWidth.5xl))/2)]" />
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-[340px] sm:w-[400px]"
          >
            <div className="h-full rounded-2xl border border-brand-border bg-brand-surface-card p-8 transition-all hover:border-brand-border-hover hover:scale-[1.02]">
              <Quote className="h-8 w-8 text-brand-primary opacity-40 mb-4" />
              <p className="text-base leading-relaxed text-zinc-300">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                  }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-zinc-500">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="shrink-0 w-6" />
      </div>
    </section>
  );
}
