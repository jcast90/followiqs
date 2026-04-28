"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type FlowStep = {
  id: string;
  name: string;
  type: "trigger" | "action" | "condition" | "transform";
  integration?: string;
};

export const DEFAULT_STEPS: FlowStep[] = [
  {
    id: "step_trigger",
    name: "On new Stripe checkout.session.completed",
    type: "trigger",
    integration: "stripe",
  },
  {
    id: "step_enrich",
    name: "enrich-contact-from-clearbit",
    type: "action",
    integration: "clearbit",
  },
  {
    id: "step_branch",
    name: "If MRR > $500",
    type: "condition",
  },
  {
    id: "step_slack",
    name: "send-slack-message to #sales",
    type: "action",
    integration: "slack",
  },
  {
    id: "step_hubspot",
    name: "upsert-hubspot-contact",
    type: "action",
    integration: "hubspot",
  },
];

function typeTone(t: FlowStep["type"]): "default" | "secondary" | "outline" {
  switch (t) {
    case "trigger":
      return "default";
    case "condition":
      return "secondary";
    default:
      return "outline";
  }
}

export function FlowCanvas({
  steps = DEFAULT_STEPS,
  selectedId,
  onSelect,
}: {
  steps?: FlowStep[];
  selectedId?: string;
  onSelect?: (stepId: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Flow canvas</CardTitle>
        <Button size="sm" variant="outline" type="button">
          Add step
        </Button>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2">
          {steps.map((step, i) => {
            const active = step.id === selectedId;
            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(step.id)}
                  className={
                    "flex w-full items-center justify-between rounded-md border px-4 py-3 text-left transition " +
                    (active
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50")
                  }
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={typeTone(step.type)}>{step.type}</Badge>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                    {step.integration ? (
                      <div className="mt-1 font-mono text-xs text-muted-foreground">
                        via {step.integration}
                      </div>
                    ) : null}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    #{i + 1}
                  </span>
                </button>
                {i < steps.length - 1 ? (
                  <div
                    className="mx-auto my-1 text-muted-foreground"
                    aria-hidden="true"
                  >
                    {"↓"}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
