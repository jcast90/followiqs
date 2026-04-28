"use client";

import { resolveLandingConfig } from "@/lib/config";
import { GradientText } from "./gradient-text";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const { landing } = resolveLandingConfig();
  const faq = landing.faq;
  if (!faq?.length) return null;

  return (
    <section className="px-6 py-24 border-t border-brand-border">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl mb-16">
          Frequently asked <GradientText>questions</GradientText>
        </h2>

        <div className="space-y-3">
          {faq.map((item, i) => (
            <FaqAccordionItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqAccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-xl border border-brand-border bg-brand-surface-card transition-all hover:border-brand-border-hover">
      <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-base font-medium list-none">
        {question}
        <ChevronDown className="h-4 w-4 text-zinc-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">
        {answer}
      </div>
    </details>
  );
}
