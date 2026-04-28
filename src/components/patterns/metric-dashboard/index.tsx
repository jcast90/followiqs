"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface Metric {
  id: string;
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  series: number[];
  format?: (v: number | string) => string;
}

export interface MetricDashboardProps {
  metrics: Metric[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export interface SparklineProps {
  points: number[];
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
}

export function Sparkline({
  points,
  width = 100,
  height = 32,
  className,
  stroke = "currentColor",
}: SparklineProps) {
  if (!points || points.length === 0) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = points.length > 1 ? width / (points.length - 1) : width;

  const coords = points.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return [x, y] as const;
  });

  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const areaPath = `${path} L${width},${height} L0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={areaPath} fill={stroke} fillOpacity={0.1} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function MetricDashboard({ metrics, className, columns = 4 }: MetricDashboardProps) {
  const gridClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-4", gridClass, className)}>
      {metrics.map((m) => {
        const deltaPositive = typeof m.delta === "number" && m.delta >= 0;
        return (
          <Card key={m.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {m.label}
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {m.format ? m.format(m.value) : m.value}
                  </div>
                  {typeof m.delta === "number" && (
                    <div
                      className={cn(
                        "mt-1 text-xs font-medium",
                        deltaPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {deltaPositive ? "▲" : "▼"} {Math.abs(m.delta).toFixed(1)}%
                      {m.deltaLabel && <span className="ml-1 text-muted-foreground font-normal">{m.deltaLabel}</span>}
                    </div>
                  )}
                </div>
                <div className={cn("shrink-0", deltaPositive ? "text-emerald-500" : "text-primary")}>
                  <Sparkline points={m.series} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
