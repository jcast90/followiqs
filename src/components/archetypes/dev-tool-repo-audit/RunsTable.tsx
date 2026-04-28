"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type RunStatus = "queued" | "running" | "passed" | "failed";

type Run = {
  id: string;
  repo: string;
  branch: string;
  status: RunStatus;
  coverage: number | null;
  startedAt: string;
  durationSec: number | null;
};

const MOCK_RUNS: Run[] = [
  {
    id: "run_01H9X",
    repo: "acme/api",
    branch: "main",
    status: "passed",
    coverage: 68,
    startedAt: "2026-04-14T17:02:00Z",
    durationSec: 124,
  },
  {
    id: "run_01H9W",
    repo: "acme/api",
    branch: "feat/new-billing",
    status: "failed",
    coverage: 61,
    startedAt: "2026-04-14T12:18:00Z",
    durationSec: 142,
  },
  {
    id: "run_01H9V",
    repo: "acme/worker",
    branch: "main",
    status: "passed",
    coverage: 74,
    startedAt: "2026-04-13T23:40:00Z",
    durationSec: 98,
  },
  {
    id: "run_01H9U",
    repo: "acme/api",
    branch: "main",
    status: "running",
    coverage: null,
    startedAt: "2026-04-14T17:59:00Z",
    durationSec: null,
  },
];

// VOS-204: hydration-safe formatter. Explicit locale + UTC timezone so
// server and client render identical strings (prevents React error #418).
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

function formatStartedAt(iso: string): string {
  return DATE_FMT.format(new Date(iso));
}

function statusTone(s: RunStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (s) {
    case "passed":
      return "default";
    case "failed":
      return "destructive";
    case "running":
      return "secondary";
    default:
      return "outline";
  }
}

export function RunsTable() {
  const [showFailedOnly, setShowFailedOnly] = React.useState(false);
  const runs = showFailedOnly
    ? MOCK_RUNS.filter((r) => r.status === "failed")
    : MOCK_RUNS;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent runs</CardTitle>
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={showFailedOnly}
            onCheckedChange={setShowFailedOnly}
          />
          Show failed only
        </label>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-2 text-left">Run</th>
                <th className="px-4 py-2 text-left">Repo / branch</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Coverage</th>
                <th className="px-4 py-2 text-left">Started</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {runs.map((r) => (
                <tr key={r.id}>
                  <td className="px-6 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.repo}</div>
                    <div className="text-xs text-muted-foreground">{r.branch}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusTone(r.status)}>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {r.coverage !== null ? `${r.coverage}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatStartedAt(r.startedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" type="button">
                      View
                    </Button>
                    {r.status === "failed" ? (
                      <Button variant="outline" size="sm" type="button">
                        Retry
                      </Button>
                    ) : null}
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
