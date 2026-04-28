"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StepStatus = "succeeded" | "failed" | "running" | "skipped";

type TimelineStep = {
  id: string;
  name: string;
  status: StepStatus;
  startedAt: string;
  durationMs: number | null;
};

const MOCK_TIMELINE: TimelineStep[] = [
  {
    id: "t_trigger",
    name: "Webhook received",
    status: "succeeded",
    startedAt: "2026-04-14T18:04:00Z",
    durationMs: 12,
  },
  {
    id: "t_enrich",
    name: "enrich-contact-from-clearbit",
    status: "succeeded",
    startedAt: "2026-04-14T18:04:01Z",
    durationMs: 1422,
  },
  {
    id: "t_branch",
    name: "Condition: MRR > $500",
    status: "succeeded",
    startedAt: "2026-04-14T18:04:03Z",
    durationMs: 3,
  },
  {
    id: "t_slack",
    name: "send-slack-message to #sales",
    status: "failed",
    startedAt: "2026-04-14T18:04:03Z",
    durationMs: 842,
  },
  {
    id: "t_hubspot",
    name: "upsert-hubspot-contact",
    status: "skipped",
    startedAt: "2026-04-14T18:04:04Z",
    durationMs: null,
  },
];

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

export function RunTimeline({
  steps = MOCK_TIMELINE,
}: {
  steps?: TimelineStep[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative ml-4 space-y-4 border-l pl-6">
          {steps.map((s) => (
            <li key={s.id} className="relative">
              <span
                className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary"
                aria-hidden="true"
              />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {s.startedAt}
                    {s.durationMs !== null
                      ? ` · ${s.durationMs} ms`
                      : " · —"}
                  </div>
                </div>
                <Badge variant={tone(s.status)}>{s.status}</Badge>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
