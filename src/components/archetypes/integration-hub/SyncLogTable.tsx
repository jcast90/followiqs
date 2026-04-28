"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type SyncEvent = {
  id: string;
  connection: string;
  event: string;
  outcome: "success" | "error" | "skipped";
  durationMs: number;
  at: string;
};

const MOCK_EVENTS: SyncEvent[] = [
  {
    id: "ev_01H9X",
    connection: "conn_gh_acme",
    event: "github-repo-sync: pull_request.merged",
    outcome: "success",
    durationMs: 244,
    at: "2026-04-14T18:04:00Z",
  },
  {
    id: "ev_01H9W",
    connection: "conn_stripe_main",
    event: "stripe.customer.subscription.updated",
    outcome: "error",
    durationMs: 5120,
    at: "2026-04-14T17:14:22Z",
  },
  {
    id: "ev_01H9V",
    connection: "conn_slack_acme",
    event: "slack-lead-notifier: post to #sales",
    outcome: "success",
    durationMs: 182,
    at: "2026-04-14T17:04:11Z",
  },
  {
    id: "ev_01H9U",
    connection: "conn_hubspot_main",
    event: "hubspot.contact.upsert",
    outcome: "skipped",
    durationMs: 8,
    at: "2026-04-14T17:02:50Z",
  },
  {
    id: "ev_01H9T",
    connection: "conn_gh_acme",
    event: "github-repo-sync: push.main",
    outcome: "success",
    durationMs: 301,
    at: "2026-04-14T16:58:00Z",
  },
];

function tone(o: SyncEvent["outcome"]): "default" | "destructive" | "outline" {
  switch (o) {
    case "success":
      return "default";
    case "error":
      return "destructive";
    default:
      return "outline";
  }
}

export function SyncLogTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync log</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-2 text-left">When</th>
                <th className="px-4 py-2 text-left">Connection</th>
                <th className="px-4 py-2 text-left">Event</th>
                <th className="px-4 py-2 text-left">Outcome</th>
                <th className="px-4 py-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_EVENTS.map((e) => (
                <tr key={e.id}>
                  <td className="px-6 py-3 text-muted-foreground">{e.at}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {e.connection}
                  </td>
                  <td className="px-4 py-3">{e.event}</td>
                  <td className="px-4 py-3">
                    <Badge variant={tone(e.outcome)}>{e.outcome}</Badge>
                  </td>
                  <td className="px-4 py-3">{e.durationMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
