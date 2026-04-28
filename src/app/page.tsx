"use client";

import { resolveLandingConfig, type VentureConfig } from "@/lib/config";
import Warmth from "@/components/templates/warmth";

/* Additional templates are lazy-loaded to avoid bundling all of them */
import dynamic from "next/dynamic";

const Precision = dynamic(() => import("@/components/templates/precision"), {
  loading: () => <TemplateShell />,
});
const Momentum = dynamic(() => import("@/components/templates/momentum"), {
  loading: () => <TemplateShell />,
});
const Clarity = dynamic(() => import("@/components/templates/clarity"), {
  loading: () => <TemplateShell />,
});
const Bold = dynamic(() => import("@/components/templates/bold"), {
  loading: () => <TemplateShell />,
});
const Organic = dynamic(() => import("@/components/templates/organic"), {
  loading: () => <TemplateShell />,
});
const Dashboard = dynamic(() => import("@/components/templates/dashboard"), {
  loading: () => <TemplateShell />,
});
const Minimal = dynamic(() => import("@/components/templates/minimal"), {
  loading: () => <TemplateShell />,
});
const Marketplace = dynamic(() => import("@/components/templates/marketplace"), {
  loading: () => <TemplateShell />,
});
const Community = dynamic(() => import("@/components/templates/community"), {
  loading: () => <TemplateShell />,
});
const Agentic = dynamic(() => import("@/components/templates/agentic"), {
  loading: () => <TemplateShell />,
});
const Commerce = dynamic(() => import("@/components/templates/commerce"), {
  loading: () => <TemplateShell />,
});

const TEMPLATES: Record<string, React.ComponentType<{ config: VentureConfig }>> = {
  precision: Precision,
  warmth: Warmth,
  momentum: Momentum,
  clarity: Clarity,
  bold: Bold,
  organic: Organic,
  dashboard: Dashboard,
  minimal: Minimal,
  marketplace: Marketplace,
  community: Community,
  agentic: Agentic,
  commerce: Commerce,
};

function TemplateShell() {
  return (
    <div className="min-h-screen bg-brand-surface text-white flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    </div>
  );
}

export default function LandingPage() {
  const resolvedConfig = resolveLandingConfig();
  const templateKey = resolvedConfig.landing.template || "warmth";
  const Template = TEMPLATES[templateKey] || Warmth;
  return <Template config={resolvedConfig} />;
}
