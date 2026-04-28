"use client";

import { useState } from "react";
import config, { resolveLandingConfig, isLiveMode, type PricingTier } from "@/lib/config";
import { GradientText } from "./gradient-text";
import { ArrowRight, Check } from "lucide-react";

type PricingVariant = "cards" | "table" | "glass";
type BillingPeriod = "monthly" | "annual";

/** Dynamic grid classes based on number of pricing tiers */
function pricingGridCols(count: number): string {
  switch (count) {
    case 1:
      return "grid-cols-1 sm:max-w-sm mx-auto";
    case 2:
      return "grid-cols-1 sm:grid-cols-2 sm:max-w-[780px] mx-auto";
    case 4:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    case 3:
    default:
      return "grid-cols-1 sm:grid-cols-3";
  }
}

/** Resolve display price based on billing period */
function tierPrice(tier: PricingTier, period: BillingPeriod): string {
  if (period === "annual" && tier.annualPrice) return tier.annualPrice;
  if (period === "monthly" && tier.monthlyPrice) return tier.monthlyPrice;
  return tier.price;
}

/** Billing period toggle */
function BillingToggle({
  period,
  onChange,
  annualDiscount,
}: {
  period: BillingPeriod;
  onChange: (p: BillingPeriod) => void;
  annualDiscount?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 mb-12">
      <button
        onClick={() => onChange("monthly")}
        className={`text-sm font-medium transition-colors ${period === "monthly" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange(period === "monthly" ? "annual" : "monthly")}
        className="relative h-7 w-12 rounded-full transition-colors"
        style={{
          background: period === "annual"
            ? "linear-gradient(to right, var(--brand-primary), var(--brand-accent))"
            : "var(--brand-border-color)",
        }}
      >
        <span
          className="absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform"
          style={{ left: period === "annual" ? "calc(100% - 1.625rem)" : "0.125rem" }}
        />
      </button>
      <span className="flex items-center gap-2">
        <button
          onClick={() => onChange("annual")}
          className={`text-sm font-medium transition-colors ${period === "annual" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Annual
        </button>
        {annualDiscount && (
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
            style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }}
          >
            {annualDiscount}
          </span>
        )}
      </span>
    </div>
  );
}

export function PricingSection({
  variant = "cards",
}: {
  variant?: PricingVariant;
}) {
  const { landing } = resolveLandingConfig();
  const waitlistMode = config.flags?.waitlistMode ?? true;
  if (waitlistMode && !isLiveMode) return null;

  const toggle = landing.pricingToggle;
  const [period, setPeriod] = useState<BillingPeriod>(toggle?.default ?? "annual");
  const showToggle = !!(toggle?.enabled && landing.pricing.some((t) => t.monthlyPrice || t.annualPrice));

  if (variant === "table") return <PricingTable landing={landing} period={period} setPeriod={setPeriod} showToggle={showToggle} toggle={toggle} />;
  if (variant === "glass") return <PricingGlass landing={landing} period={period} setPeriod={setPeriod} showToggle={showToggle} toggle={toggle} />;
  return <PricingCards landing={landing} period={period} setPeriod={setPeriod} showToggle={showToggle} toggle={toggle} />;
}

type PricingProps = {
  landing: ReturnType<typeof resolveLandingConfig>["landing"];
  period: BillingPeriod;
  setPeriod: (p: BillingPeriod) => void;
  showToggle: boolean;
  toggle: ReturnType<typeof resolveLandingConfig>["landing"]["pricingToggle"];
};

/* ─── Card variant (Warmth) ─── */
function PricingCards({ landing, period, setPeriod, showToggle, toggle }: PricingProps) {
  return (
    <section id="pricing" className="px-6 py-24 border-t border-brand-border">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, <GradientText>transparent</GradientText> pricing
          </h2>
          <p className="mt-4 text-zinc-400">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        {showToggle && (
          <BillingToggle period={period} onChange={setPeriod} annualDiscount={toggle?.annualDiscount} />
        )}

        <div className={`grid gap-6 ${pricingGridCols(landing.pricing.length)}`}>
          {landing.pricing.map((tier, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                tier.highlighted
                  ? "border-brand-primary/30 shadow-2xl"
                  : "border-brand-border bg-brand-surface-card hover:border-brand-border-hover"
              }`}
              style={
                tier.highlighted
                  ? {
                      background: `linear-gradient(to bottom, color-mix(in srgb, var(--brand-primary) 8%, transparent), color-mix(in srgb, var(--brand-accent) 4%, transparent))`,
                      boxShadow: `0 25px 50px -12px color-mix(in srgb, var(--brand-primary) 10%, transparent)`,
                    }
                  : undefined
              }
            >
              {tier.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{tier.plan}</h3>
                <p className="mt-1 text-sm text-zinc-400">{tier.desc}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold">{tierPrice(tier, period)}</span>
                {tier.period && (
                  <span className="text-zinc-500">{tier.period}</span>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/signup"
                className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  tier.highlighted
                    ? "text-white hover:shadow-lg"
                    : "border border-brand-border bg-brand-surface-input hover:bg-brand-surface-input"
                }`}
                style={
                  tier.highlighted
                    ? {
                        background:
                          "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
                      }
                    : undefined
                }
              >
                {tier.cta || "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Table variant (Precision) ─── */
function PricingTable({ landing, period, setPeriod, showToggle, toggle }: PricingProps) {
  return (
    <section id="pricing" className="px-6 py-20 border-t border-brand-border">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold tracking-tight mb-12">Pricing</h2>
        {showToggle && (
          <BillingToggle period={period} onChange={setPeriod} annualDiscount={toggle?.annualDiscount} />
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="py-4 pr-8 text-left text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  Plan
                </th>
                <th className="py-4 pr-8 text-left text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  Price
                </th>
                <th className="py-4 text-left text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  Includes
                </th>
              </tr>
            </thead>
            <tbody>
              {landing.pricing.map((tier, i) => (
                <tr
                  key={i}
                  className={`border-b border-brand-border ${tier.highlighted ? "bg-brand-surface-card" : ""}`}
                >
                  <td className="py-5 pr-8">
                    <span className="font-semibold">{tier.plan}</span>
                    {tier.highlighted && (
                      <span className="ml-2 text-xs text-brand-primary">
                        recommended
                      </span>
                    )}
                  </td>
                  <td className="py-5 pr-8 font-mono text-lg">
                    {tierPrice(tier, period)}
                    <span className="text-xs text-zinc-500">{tier.period}</span>
                  </td>
                  <td className="py-5 text-zinc-400">
                    {tier.features.join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── Glass variant (Momentum) ─── */
function PricingGlass({ landing, period, setPeriod, showToggle, toggle }: PricingProps) {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <GradientText>Pricing</GradientText>
          </h2>
        </div>

        {showToggle && (
          <BillingToggle period={period} onChange={setPeriod} annualDiscount={toggle?.annualDiscount} />
        )}

        <div className={`grid gap-6 ${pricingGridCols(landing.pricing.length)}`}>
          {landing.pricing.map((tier, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl p-8 backdrop-blur-xl transition-all ${
                tier.highlighted
                  ? "bg-brand-surface-input shadow-2xl"
                  : "bg-brand-surface-card hover:bg-brand-surface-input"
              }`}
              style={{
                border: tier.highlighted
                  ? "1px solid color-mix(in srgb, var(--brand-primary) 40%, transparent)"
                  : "1px solid var(--brand-border-color)",
              }}
            >
              {tier.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(to right, var(--brand-primary), var(--brand-accent))",
                  }}
                >
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold">{tier.plan}</h3>
              <p className="mt-1 text-sm text-zinc-400">{tier.desc}</p>

              <div className="my-6">
                <span className="text-4xl font-bold">{tierPrice(tier, period)}</span>
                {tier.period && (
                  <span className="text-zinc-500">{tier.period}</span>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
                style={{
                  background: tier.highlighted
                    ? "linear-gradient(to right, var(--brand-primary), var(--brand-accent))"
                    : "var(--brand-border-color)",
                }}
              >
                {tier.cta || "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
