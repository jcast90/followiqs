"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StepStatus = "succeeded" | "running" | "pending" | "failed";

type PipelineStep = {
  id: string;
  name: string;
  status: StepStatus;
};

const DEFAULT_STEPS: PipelineStep[] = [
  { id: "extract", name: "Extract", status: "succeeded" },
  { id: "validate", name: "Validate", status: "succeeded" },
  { id: "transform", name: "Transform", status: "running" },
  { id: "load", name: "Load", status: "pending" },
  { id: "notify", name: "Notify", status: "pending" },
];

function color(s: StepStatus): string {
  switch (s) {
    case "succeeded":
      return "bg-emerald-500";
    case "running":
      return "bg-primary animate-pulse";
    case "failed":
      return "bg-red-500";
    default:
      return "bg-muted";
  }
}

function tone(s: StepStatus): "default" | "destructive" | "secondary" | "outline" {
  switch (s) {
    case "succeeded":
      return "default";
    case "failed":
      return "destructive";
    case "running":
      return "secondary";
    default:
      return "outline";
  }
}

export function ProgressBar({
  steps = DEFAULT_STEPS,
}: {
  steps?: PipelineStep[];
}) {
  const done = steps.filter((s) => s.status === "succeeded").length;
  const pct = Math.round((done / steps.length) * 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Progress</CardTitle>
        <span className="font-mono text-xs text-muted-foreground">
          {done} / {steps.length} · {pct}%
        </span>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-2 sm:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.id} className="space-y-1">
              <div className={"h-1.5 w-full rounded " + color(s.status)} />
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  {i + 1}. {s.name}
                </span>
                <Badge variant={tone(s.status)}>{s.status}</Badge>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
