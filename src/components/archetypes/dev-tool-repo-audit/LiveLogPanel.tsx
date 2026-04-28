"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * LiveLogPanel — streams run logs over Server-Sent Events (EventSource).
 * Colorises basic ANSI codes from the producer.
 */
const ANSI = {
  reset: "\u001b[0m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
  grey: "\u001b[90m",
} as const;

function ansiToHtml(line: string): React.ReactNode {
  // Split on ANSI color codes and render spans. Simple, safe impl.
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
  `${ANSI.grey}[00:00] Cloning repo…${ANSI.reset}`,
  `${ANSI.green}[00:02] Clone complete (127 files)${ANSI.reset}`,
  `${ANSI.grey}[00:03] Installing dev deps…${ANSI.reset}`,
  `${ANSI.grey}[00:18] Running coverage pass…${ANSI.reset}`,
  `${ANSI.yellow}[00:32] Warn: 3 files have 0% coverage${ANSI.reset}`,
  `${ANSI.green}[00:41] Audit complete — 68% coverage${ANSI.reset}`,
];

export function LiveLogPanel({ runId }: { runId?: string }) {
  const [lines, setLines] = React.useState<string[]>(MOCK_LINES);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!runId) return;
    const es = new EventSource(`/api/runs/${runId}/stream`);
    es.onmessage = (ev) => {
      setLines((prev) => [...prev, ev.data]);
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [runId]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live log{runId ? ` — ${runId}` : ""}</CardTitle>
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
