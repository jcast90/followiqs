"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type HourlyThroughput = {
  hour: string;
  completed: number;
  failed: number;
};

const MOCK_THROUGHPUT: HourlyThroughput[] = [
  { hour: "09:00", completed: 12, failed: 0 },
  { hour: "10:00", completed: 18, failed: 1 },
  { hour: "11:00", completed: 22, failed: 0 },
  { hour: "12:00", completed: 9, failed: 2 },
  { hour: "13:00", completed: 14, failed: 0 },
  { hour: "14:00", completed: 21, failed: 1 },
  { hour: "15:00", completed: 17, failed: 0 },
  { hour: "16:00", completed: 24, failed: 0 },
];

export function QueueStatus() {
  const maxBar = Math.max(...MOCK_THROUGHPUT.map((h) => h.completed));
  const queueDepth = 7;
  const inFlight = 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <div className="text-xs text-muted-foreground">Queue depth</div>
            <div className="text-2xl font-semibold">{queueDepth}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">In flight</div>
            <div className="text-2xl font-semibold">{inFlight}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Status</div>
            <Badge className="mt-1">healthy</Badge>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">Throughput (last 8h)</h4>
          <div className="flex h-32 items-end gap-2">
            {MOCK_THROUGHPUT.map((h) => {
              const pct = Math.round((h.completed / maxBar) * 100);
              return (
                <div
                  key={h.hour}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div className="flex h-full w-full flex-col justify-end">
                    <div
                      className="w-full rounded-t bg-primary/80"
                      style={{ height: `${pct}%` }}
                      title={`${h.completed} completed / ${h.failed} failed`}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {h.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
