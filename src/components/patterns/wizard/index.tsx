"use client";

/**
 * Wizard — Multi-step form with progress indicator, step validation, and navigation.
 * Headless-first: you supply the steps, the wizard manages state and transitions.
 */

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  /** Return true if the step is valid and can proceed */
  validate?: () => boolean | Promise<boolean>;
  /** Rendered step content */
  content: React.ReactNode;
  /** Optional custom icon (number shown by default) */
  icon?: React.ReactNode;
}

export interface WizardProps {
  steps: WizardStep[];
  onComplete?: (stepIndex: number) => void | Promise<void>;
  /** Called when the user navigates between steps */
  onStepChange?: (from: number, to: number) => void;
  completionContent?: React.ReactNode;
  className?: string;
  /** "horizontal" for top progress bar, "vertical" for side stepper */
  layout?: "horizontal" | "vertical";
  completeLabel?: string;
  nextLabel?: string;
  backLabel?: string;
}

function StepIndicator({
  steps,
  currentStep,
  layout,
}: {
  steps: WizardStep[];
  currentStep: number;
  layout: "horizontal" | "vertical";
}) {
  if (layout === "vertical") {
    return (
      <div className="flex flex-col gap-0 pr-6 shrink-0 w-48 hidden md:flex">
        {steps.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={step.id} className="flex gap-3">
              {/* Connector + dot column */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border-2 z-10 transition-all",
                    done
                      ? "border-transparent"
                      : active
                      ? "border-transparent"
                      : "border-white/10"
                  )}
                  style={
                    done || active
                      ? {
                          background: done
                            ? "var(--brand-primary)"
                            : "color-mix(in srgb, var(--brand-primary) 20%, transparent)",
                          borderColor: done
                            ? "var(--brand-primary)"
                            : "var(--brand-primary)",
                        }
                      : {}
                  }
                >
                  {done ? (
                    <Check className="size-3.5 text-white" />
                  ) : (
                    step.icon ?? (
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          active ? "text-white" : "text-white/30"
                        )}
                      >
                        {i + 1}
                      </span>
                    )
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="w-px flex-1 mt-0.5 mb-0.5 min-h-[1.5rem]"
                    style={{
                      background: i < currentStep
                        ? "var(--brand-primary)"
                        : "var(--brand-border-color)",
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <div className="pb-4 pt-0.5 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium leading-tight",
                    active ? "text-white" : done ? "text-white/60" : "text-white/30"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs text-white/30 leading-snug">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal
  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                )}
                style={{
                  borderColor:
                    done || active ? "var(--brand-primary)" : "var(--brand-border-color)",
                  background:
                    done
                      ? "var(--brand-primary)"
                      : active
                      ? "color-mix(in srgb, var(--brand-primary) 15%, transparent)"
                      : "transparent",
                }}
              >
                {done ? (
                  <Check className="size-3.5 text-white" />
                ) : (
                  step.icon ?? (
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        active ? "text-white" : "text-white/30"
                      )}
                      style={active ? { color: "var(--brand-primary)" } : {}}
                    >
                      {i + 1}
                    </span>
                  )
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium whitespace-nowrap hidden sm:block",
                  active ? "text-white" : done ? "text-white/50" : "text-white/25"
                )}
              >
                {step.title}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-2 mb-4"
                style={{
                  background:
                    i < currentStep
                      ? "var(--brand-primary)"
                      : "var(--brand-border-color)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Wizard({
  steps,
  onComplete,
  onStepChange,
  completionContent,
  className,
  layout = "horizontal",
  completeLabel = "Complete",
  nextLabel = "Continue",
  backLabel = "Back",
}: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLast = currentStep === steps.length - 1;

  const goNext = useCallback(async () => {
    const step = steps[currentStep];
    setErrorMsg(null);
    if (step.validate) {
      setLoading(true);
      try {
        const valid = await step.validate();
        if (!valid) {
          setErrorMsg("Please complete this step before continuing.");
          setLoading(false);
          return;
        }
      } catch {
        setErrorMsg("Validation failed. Please try again.");
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    if (isLast) {
      setLoading(true);
      try {
        await onComplete?.(currentStep);
        setCompleted(true);
      } finally {
        setLoading(false);
      }
      return;
    }

    onStepChange?.(currentStep, currentStep + 1);
    setCurrentStep((p) => p + 1);
  }, [currentStep, steps, isLast, onComplete, onStepChange]);

  const goBack = useCallback(() => {
    if (currentStep === 0) return;
    setErrorMsg(null);
    onStepChange?.(currentStep, currentStep - 1);
    setCurrentStep((p) => p - 1);
  }, [currentStep, onStepChange]);

  if (completed && completionContent) {
    return <div className={className}>{completionContent}</div>;
  }

  const content = (
    <div className={cn("flex flex-col gap-6", layout === "vertical" && "md:flex-row")}>
      <StepIndicator steps={steps} currentStep={currentStep} layout={layout} />

      <div className="flex-1 min-w-0">
        {layout === "horizontal" && (
          <StepIndicator steps={steps} currentStep={currentStep} layout="horizontal" />
        )}

        {/* Step content area */}
        <div
          className="rounded-xl border p-5 mb-4"
          style={{
            borderColor: "var(--brand-border-color)",
            background: "var(--brand-surface-light)",
          }}
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold text-white">
              {steps[currentStep].title}
            </h3>
            {steps[currentStep].description && (
              <p className="mt-0.5 text-sm text-white/40">
                {steps[currentStep].description}
              </p>
            )}
          </div>

          {steps[currentStep].content}

          {errorMsg && (
            <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/50 hover:text-white hover:bg-white/10"
            disabled={currentStep === 0}
            onClick={goBack}
          >
            <ChevronLeft className="size-4 mr-1" />
            {backLabel}
          </Button>

          <span className="text-xs text-white/30 tabular-nums">
            {currentStep + 1} / {steps.length}
          </span>

          <Button
            size="sm"
            onClick={goNext}
            disabled={loading}
            style={{
              background: "var(--brand-primary)",
              color: "var(--brand-primary-foreground, #fff)",
            }}
          >
            {loading ? (
              <Loader2 className="size-4 mr-1.5 animate-spin" />
            ) : isLast ? null : (
              <ChevronRight className="size-4 ml-1 order-last" />
            )}
            {isLast ? completeLabel : nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );

  return layout === "vertical" ? (
    <div className={cn("w-full", className)}>{content}</div>
  ) : (
    <div className={cn("w-full", className)}>{content}</div>
  );
}
