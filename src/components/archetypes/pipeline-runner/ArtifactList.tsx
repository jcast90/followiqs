"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Artifact = {
  id: string;
  jobId: string;
  name: string;
  sizeBytes: number;
  createdAt: string;
  kind: "report" | "dataset" | "build" | "log";
};

const MOCK_ARTIFACTS: Artifact[] = [
  {
    id: "art_01H9X",
    jobId: "job_nightly_etl_2026_04_14",
    name: "daily-report-2026-04-14.csv",
    sizeBytes: 1_842_112,
    createdAt: "2026-04-14T06:15:00Z",
    kind: "report",
  },
  {
    id: "art_01H9W",
    jobId: "job_nightly_etl_2026_04_14",
    name: "warehouse-dump.parquet",
    sizeBytes: 124_993_021,
    createdAt: "2026-04-14T06:16:00Z",
    kind: "dataset",
  },
  {
    id: "art_01H9V",
    jobId: "job_daily_build_main",
    name: "app-bundle-v2.184.tar.gz",
    sizeBytes: 42_221_440,
    createdAt: "2026-04-14T10:04:00Z",
    kind: "build",
  },
  {
    id: "art_01H9U",
    jobId: "job_daily_build_main",
    name: "build.log",
    sizeBytes: 244_100,
    createdAt: "2026-04-14T10:04:00Z",
    kind: "log",
  },
  {
    id: "art_01H9T",
    jobId: "job_weekly_compliance",
    name: "compliance-2026-W15.pdf",
    sizeBytes: 812_002,
    createdAt: "2026-04-13T23:30:00Z",
    kind: "report",
  },
];

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function ArtifactList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Artifacts</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Job</th>
                <th className="px-4 py-2 text-left">Kind</th>
                <th className="px-4 py-2 text-left">Size</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_ARTIFACTS.map((a) => (
                <tr key={a.id}>
                  <td className="px-6 py-3 font-mono text-xs">{a.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {a.jobId}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{a.kind}</Badge>
                  </td>
                  <td className="px-4 py-3">{formatBytes(a.sizeBytes)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {a.createdAt}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => void 0}
                    >
                      Download
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
