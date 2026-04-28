"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type JobStatus = "queued" | "running" | "succeeded" | "failed";

type Job = {
  id: string;
  name: string;
  status: JobStatus;
  startedAt: string;
  durationSec: number | null;
};

const MOCK_JOBS: Job[] = [
  {
    id: "job_nightly_etl_2026_04_14",
    name: "nightly-etl",
    status: "succeeded",
    startedAt: "2026-04-14T06:00:00Z",
    durationSec: 73,
  },
  {
    id: "job_daily_report_2026_04_14",
    name: "daily-report-generation",
    status: "succeeded",
    startedAt: "2026-04-14T07:00:00Z",
    durationSec: 41,
  },
  {
    id: "job_daily_build_main_17",
    name: "daily-build",
    status: "failed",
    startedAt: "2026-04-14T10:04:00Z",
    durationSec: 184,
  },
  {
    id: "job_hourly_sync_1614",
    name: "hourly-sync",
    status: "running",
    startedAt: "2026-04-14T18:00:00Z",
    durationSec: null,
  },
  {
    id: "job_weekly_compliance_w15",
    name: "weekly-compliance-report",
    status: "queued",
    startedAt: "2026-04-14T23:00:00Z",
    durationSec: null,
  },
];

function tone(s: JobStatus): "default" | "destructive" | "secondary" | "outline" {
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

export function JobsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-2 text-left">Job</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Started</th>
                <th className="px-4 py-2 text-left">Duration</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_JOBS.map((j) => (
                <tr key={j.id}>
                  <td className="px-6 py-3">
                    <div className="font-medium">{j.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {j.id}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={tone(j.status)}>{j.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {j.startedAt}
                  </td>
                  <td className="px-4 py-3">
                    {j.durationSec !== null ? `${j.durationSec}s` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" type="button">
                      View
                    </Button>
                    {j.status === "failed" ? (
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
