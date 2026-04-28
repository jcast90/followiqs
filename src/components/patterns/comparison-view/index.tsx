"use client";

/**
 * ComparisonView — Side-by-side or table comparison of plans/features/products.
 * Supports checkmark/cross cells, custom render, and highlight columns.
 */

import { cn } from "@/lib/utils";
import { Check, X, Minus } from "lucide-react";

export type ComparisonCellValue =
  | boolean
  | string
  | number
  | null
  | React.ReactNode;

export interface ComparisonColumn {
  id: string;
  label: string;
  sublabel?: string;
  highlighted?: boolean;
  badge?: string;
}

export interface ComparisonRow {
  id: string;
  label: string;
  category?: string;
  values: Record<string, ComparisonCellValue>;
  /** Custom render overrides the default boolean/string logic */
  render?: (value: ComparisonCellValue, columnId: string) => React.ReactNode;
}

export interface ComparisonViewProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  /** Show category separators between rows with different categories */
  groupByCategory?: boolean;
  className?: string;
  stickyHeader?: boolean;
}

function DefaultCell({ value }: { value: ComparisonCellValue }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center rounded-full size-5 bg-green-500/15">
        <Check className="size-3 text-green-400" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center size-5">
        <X className="size-3 text-white/20" />
      </span>
    );
  }
  if (value === null || value === undefined) {
    return <Minus className="size-3 text-white/20" />;
  }
  return (
    <span className="text-sm text-white/80">{String(value)}</span>
  );
}

function groupRows(rows: ComparisonRow[]) {
  const groups: { category: string | undefined; rows: ComparisonRow[] }[] = [];
  for (const row of rows) {
    const last = groups[groups.length - 1];
    if (last && last.category === row.category) {
      last.rows.push(row);
    } else {
      groups.push({ category: row.category, rows: [row] });
    }
  }
  return groups;
}

export function ComparisonView({
  columns,
  rows,
  groupByCategory = true,
  className,
  stickyHeader = false,
}: ComparisonViewProps) {
  const groups = groupByCategory ? groupRows(rows) : [{ category: undefined, rows }];

  return (
    <div className={cn("overflow-x-auto rounded-xl border", className)}
      style={{ borderColor: "var(--brand-border-color)" }}
    >
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr
            className={cn(
              "border-b",
              stickyHeader && "sticky top-0 z-10"
            )}
            style={{
              borderColor: "var(--brand-border-color)",
              background: "var(--brand-surface-light)",
            }}
          >
            {/* Feature label column */}
            <th className="px-4 py-3 text-left text-xs font-medium text-white/30 w-48 min-w-[10rem]">
              Feature
            </th>

            {columns.map((col) => (
              <th
                key={col.id}
                className={cn(
                  "px-4 py-3 text-center align-top",
                  col.highlighted && "relative"
                )}
                style={
                  col.highlighted
                    ? {
                        background:
                          "color-mix(in srgb, var(--brand-primary) 6%, transparent)",
                      }
                    : undefined
                }
              >
                {col.highlighted && (
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: "var(--brand-primary)" }}
                  />
                )}
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      col.highlighted ? "text-white" : "text-white/70"
                    )}
                  >
                    {col.label}
                  </span>
                  {col.sublabel && (
                    <span className="text-xs text-white/40">{col.sublabel}</span>
                  )}
                  {col.badge && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        background:
                          "color-mix(in srgb, var(--brand-primary) 15%, transparent)",
                        color: "var(--brand-primary)",
                      }}
                    >
                      {col.badge}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {groups.map((group, gi) => (
            <>
              {groupByCategory && group.category && (
                <tr
                  key={`cat-${gi}`}
                  className="border-b"
                  style={{
                    borderColor: "var(--brand-border-color)",
                    background: "var(--brand-surface)",
                  }}
                >
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/30"
                  >
                    {group.category}
                  </td>
                </tr>
              )}

              {group.rows.map((row, ri) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b transition-colors",
                    ri < group.rows.length - 1 || gi < groups.length - 1
                      ? "border-b"
                      : "border-b-0"
                  )}
                  style={{
                    borderColor: "var(--brand-border-color)",
                    background: "var(--brand-surface-light)",
                  }}
                >
                  <td className="px-4 py-3 text-sm text-white/60">{row.label}</td>

                  {columns.map((col) => {
                    const raw = row.values[col.id];
                    return (
                      <td
                        key={col.id}
                        className="px-4 py-3 text-center"
                        style={
                          col.highlighted
                            ? {
                                background:
                                  "color-mix(in srgb, var(--brand-primary) 4%, transparent)",
                              }
                            : undefined
                        }
                      >
                        <div className="flex justify-center">
                          {row.render ? (
                            row.render(raw, col.id)
                          ) : (
                            <DefaultCell value={raw} />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
