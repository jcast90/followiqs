"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * ResultDiffViewer — before/after coverage diff for a pair of runs.
 */
type FileDiff = {
  file: string;
  before: number;
  after: number;
};

const MOCK_DIFFS: FileDiff[] = [
  { file: "src/billing/charges.ts", before: 0, after: 42 },
  { file: "src/auth/session.ts", before: 12, after: 58 },
  { file: "src/email/send.ts", before: 34, after: 34 },
  { file: "src/lib/format.ts", before: 62, after: 60 },
];

function delta(before: number, after: number): string {
  const d = after - before;
  return d === 0 ? "—" : d > 0 ? `+${d}%` : `${d}%`;
}

export function ResultDiffViewer({
  fromRun = "run_01H9W",
  toRun = "run_01H9X",
}: {
  fromRun?: string;
  toRun?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Coverage diff · <span className="font-mono text-xs">{fromRun}</span>{" "}
          → <span className="font-mono text-xs">{toRun}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-2 text-left">File</th>
              <th className="px-4 py-2 text-left">Before</th>
              <th className="px-4 py-2 text-left">After</th>
              <th className="px-4 py-2 text-left">Δ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {MOCK_DIFFS.map((d) => {
              const diff = d.after - d.before;
              return (
                <tr key={d.file}>
                  <td className="px-6 py-3 font-mono text-xs">{d.file}</td>
                  <td className="px-4 py-3">{d.before}%</td>
                  <td className="px-4 py-3">{d.after}%</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        diff > 0 ? "default" : diff < 0 ? "destructive" : "outline"
                      }
                    >
                      {delta(d.before, d.after)}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
