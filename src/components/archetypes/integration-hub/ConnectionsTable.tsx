"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SyncStatusBadge, type SyncState } from "./SyncStatusBadge";

type Connection = {
  id: string;
  provider: string;
  label: string;
  status: SyncState;
  lastSyncAt: string;
  errorCount: number;
};

const MOCK_CONNECTIONS: Connection[] = [
  {
    id: "conn_gh_acme",
    provider: "github",
    label: "acme-engineering (github-repo-sync)",
    status: "healthy",
    lastSyncAt: "2026-04-14T18:00:00Z",
    errorCount: 0,
  },
  {
    id: "conn_slack_acme",
    provider: "slack",
    label: "acme.slack.com (slack-lead-notifier)",
    status: "syncing",
    lastSyncAt: "2026-04-14T18:02:00Z",
    errorCount: 0,
  },
  {
    id: "conn_stripe_main",
    provider: "stripe",
    label: "acc_stripe_live",
    status: "error",
    lastSyncAt: "2026-04-14T17:14:00Z",
    errorCount: 3,
  },
  {
    id: "conn_hubspot_main",
    provider: "hubspot",
    label: "portal 4412881",
    status: "healthy",
    lastSyncAt: "2026-04-14T18:01:00Z",
    errorCount: 0,
  },
];

export function ConnectionsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active connections</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-2 text-left">Connection</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Last sync</th>
                <th className="px-4 py-2 text-left">Errors (7d)</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_CONNECTIONS.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-3">
                    <div className="font-medium">{c.label}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {c.provider} · {c.id}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <SyncStatusBadge state={c.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.lastSyncAt}
                  </td>
                  <td className="px-4 py-3">{c.errorCount}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" type="button">
                      Logs
                    </Button>
                    <Button variant="ghost" size="sm" type="button">
                      Mappings
                    </Button>
                    <Button variant="ghost" size="sm" type="button">
                      Disconnect
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
