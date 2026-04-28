"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const ANSI = {
  reset: "\u001b[0m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
  grey: "\u001b[90m",
} as const;

function ansiToHtml(line: string): React.ReactNode {
  const parts = line.split(/(\u001b\[\d+m)/);
  let current = "text-foreground";
  return parts.map((part, i) => {
    switch (part) {
      case ANSI.reset:
        current = "text-foreground";
        return null;
      case ANSI.red:
        current = "text-red-500";
        return null;
      case ANSI.green:
        current = "text-emerald-500";
        return null;
      case ANSI.yellow:
        current = "text-amber-500";
        return null;
      case ANSI.blue:
        current = "text-blue-500";
        return null;
      case ANSI.grey:
        current = "text-muted-foreground";
        return null;
      default:
        return (
          <span key={i} className={current}>
            {part}
          </span>
        );
    }
  });
}

const MOCK_LINES = [
  `${ANSI.grey}[00:00] Job nightly-etl starting${ANSI.reset}`,
  `${ANSI.grey}[00:01] Allocating executor (4 vCPU, 8GB)${ANSI.reset}`,
  `${ANSI.blue}[00:04] Stage: extract (source=postgres://main)${ANSI.reset}`,
  `${ANSI.green}[00:27] Extracted 184,221 rows${ANSI.reset}`,
  `${ANSI.blue}[00:28] Stage: transform${ANSI.reset}`,
  `${ANSI.yellow}[00:44] Warn: 312 rows with NULL email skipped${ANSI.reset}`,
  `${ANSI.blue}[00:51] Stage: load (destination=snowflake)${ANSI.reset}`,
  `${ANSI.green}[01:12] Load complete — 183,909 rows${ANSI.reset}`,
  `${ANSI.green}[01:13] Job succeeded in 73s${ANSI.reset}`,
];

export function LiveLogPanel({ jobId }: { jobId?: string }) {
  const [lines, setLines] = React.useState<string[]>(MOCK_LINES);
  const [autoScroll, setAutoScroll] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!jobId) return;
    const es = new EventSource(`/api/jobs/${jobId}/stream`);
    es.onmessage = (ev) => setLines((prev) => [...prev, ev.data]);
    es.onerror = () => es.close();
    return () => es.close();
  }, [jobId]);

  React.useEffect(() => {
    if (!autoScroll) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, autoScroll]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live log{jobId ? ` — ${jobId}` : ""}</CardTitle>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
          Auto-scroll
        </label>
      </CardHeader>
      <CardContent>
        <div
          ref={scrollRef}
          className="max-h-80 overflow-auto rounded-md bg-zinc-950 p-4 font-mono text-xs leading-6 text-zinc-100"
        >
          {lines.map((l, i) => (
            <div key={i}>{ansiToHtml(l)}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
