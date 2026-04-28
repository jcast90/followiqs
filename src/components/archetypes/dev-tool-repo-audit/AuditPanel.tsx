"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

/**
 * AuditPanel — the core "Run audit" control for the dev-tool-repo-audit
 * archetype. Shows coverage %, untested files, and a risk-ranked function
 * list. Uses mock data until the /api/runs endpoint exists.
 */
type RiskFn = {
  file: string;
  fn: string;
  risk: "high" | "medium" | "low";
  coverage: number;
};

const MOCK_RISKS: RiskFn[] = [
  { file: "src/billing/charges.ts", fn: "refundCharge", risk: "high", coverage: 0 },
  { file: "src/auth/session.ts", fn: "rotateRefreshToken", risk: "high", coverage: 12 },
  { file: "src/email/send.ts", fn: "renderTemplate", risk: "medium", coverage: 34 },
  { file: "src/lib/format.ts", fn: "formatCurrency", risk: "low", coverage: 62 },
];

export function AuditPanel({ productName = "__VENTURE_NAME__" }: { productName?: string }) {
  const [running, setRunning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [coverage] = React.useState(68);
  const [untestedFiles] = React.useState(14);

  async function runAudit() {
    setRunning(true);
    setProgress(5);
    const tick = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 14, 97));
    }, 500);
    try {
      await fetch("/api/runs", { method: "POST" }).catch(() => null);
      // Simulate a short run for the visible UI.
      await new Promise((r) => setTimeout(r, 2500));
    } finally {
      clearInterval(tick);
      setProgress(100);
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Run a {productName} audit</CardTitle>
          <Button onClick={runAudit} disabled={running}>
            {running ? "Running…" : "Run audit"}
          </Button>
        </CardHeader>
        <CardContent>
          {running ? (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground">
                Cloning repo, running coverage, ranking risk…
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a connected repo on the Connect page, then kick off an
              audit. Results usually arrive in under two minutes.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{coverage}%</p>
            <p className="text-xs text-muted-foreground">+3.2% vs last run</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Untested files</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{untestedFiles}</p>
            <p className="text-xs text-muted-foreground">4 flagged as high-risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Last run</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">2m</p>
            <p className="text-xs text-muted-foreground">42s ago · passed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk-ranked functions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {MOCK_RISKS.map((r) => (
              <li
                key={`${r.file}:${r.fn}`}
                className="flex items-center justify-between px-6 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{r.fn}</p>
                  <p className="text-xs text-muted-foreground">{r.file}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {r.coverage}% covered
                  </span>
                  <Badge
                    variant={
                      r.risk === "high"
                        ? "destructive"
                        : r.risk === "medium"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {r.risk}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
