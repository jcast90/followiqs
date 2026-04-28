"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type LastRunStatus = "succeeded" | "failed" | "running" | "never";

type Flow = {
  id: string;
  name: string;
  trigger: "webhook" | "schedule" | "event";
  steps: number;
  lastRunAt: string | null;
  lastRunStatus: LastRunStatus;
  enabled: boolean;
};

const MOCK_FLOWS: Flow[] = [
  {
    id: "flow_slack_lead_alert",
    name: "send-slack-message on new lead",
    trigger: "event",
    steps: 4,
    lastRunAt: "2026-04-14T18:04:00Z",
    lastRunStatus: "succeeded",
    enabled: true,
  },
  {
    id: "flow_enrich_contact",
    name: "enrich-contact-from-clearbit",
    trigger: "webhook",
    steps: 6,
    lastRunAt: "2026-04-14T16:22:00Z",
    lastRunStatus: "failed",
    enabled: true,
  },
  {
    id: "flow_daily_digest",
    name: "post-daily-digest",
    trigger: "schedule",
    steps: 3,
    lastRunAt: "2026-04-14T13:00:00Z",
    lastRunStatus: "succeeded",
    enabled: true,
  },
  {
    id: "flow_stripe_sync",
    name: "stripe-customer-to-hubspot",
    trigger: "event",
    steps: 5,
    lastRunAt: null,
    lastRunStatus: "never",
    enabled: false,
  },
];

function tone(s: LastRunStatus): "default" | "secondary" | "destructive" | "outline" {
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

export function FlowsTable() {
  const [flows] = React.useState<Flow[]>(MOCK_FLOWS);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Flows</CardTitle>
        <Button type="button" onClick={() => void 0}>
          New flow
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Trigger</th>
                <th className="px-4 py-2 text-left">Steps</th>
                <th className="px-4 py-2 text-left">Last run</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {flows.map((f) => (
                <tr key={f.id}>
                  <td className="px-6 py-3">
                    <div className="font-medium">{f.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {f.id}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{f.trigger}</td>
                  <td className="px-4 py-3">{f.steps}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {f.lastRunAt ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={tone(f.lastRunStatus)}>
                      {f.lastRunStatus}
                    </Badge>
                    {!f.enabled ? (
                      <Badge variant="outline" className="ml-2">
                        paused
                      </Badge>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" type="button">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" type="button">
                      Clone
                    </Button>
                    <Button variant="ghost" size="sm" type="button">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
