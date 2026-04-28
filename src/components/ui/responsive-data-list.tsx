"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ResponsiveDataList — pairs a desktop <Table> with a mobile card list.
 *
 * Usage:
 *
 *   <ResponsiveDataList
 *     items={rows}
 *     desktop={
 *       <Table>...standard table with all columns...</Table>
 *     }
 *     mobileItem={(row) => (
 *       <ResponsiveDataCard
 *         title={row.name}
 *         subtitle={row.email}
 *         fields={[
 *           { label: "Status", value: <Badge>{row.status}</Badge> },
 *           { label: "Created", value: row.created_at },
 *         ]}
 *         actions={<DropdownMenu>...</DropdownMenu>}
 *       />
 *     )}
 *   />
 *
 * The desktop table is shown at sm: and up; the mobile card list is shown
 * below sm:. Tables that have >4 columns or long text should use this to
 * avoid horizontal scroll at 375px.
 */
export function ResponsiveDataList<T>({
  items,
  desktop,
  mobileItem,
  emptyState,
  className,
}: {
  items: readonly T[];
  desktop: React.ReactNode;
  mobileItem: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}) {
  const isEmpty = items.length === 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop + tablet: real table */}
      <div className="hidden sm:block">
        {isEmpty && emptyState ? emptyState : desktop}
      </div>

      {/* Mobile: card list */}
      <div className="space-y-3 sm:hidden">
        {isEmpty && emptyState
          ? emptyState
          : items.map((item, i) => (
              <React.Fragment key={i}>{mobileItem(item, i)}</React.Fragment>
            ))}
      </div>
    </div>
  );
}

/**
 * ResponsiveDataCard — single mobile row card. Shows a title, optional
 * subtitle, a list of label/value pairs, and an actions slot.
 */
export function ResponsiveDataCard({
  title,
  subtitle,
  fields,
  actions,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  fields: Array<{ label: string; value: React.ReactNode }>;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/[0.06] bg-brand-surface-light p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-white">{title}</div>
          {subtitle ? (
            <div className="truncate text-xs text-white/50">{subtitle}</div>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {fields.length > 0 ? (
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
          {fields.map((f, i) => (
            <div key={i} className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wide text-white/40">
                {f.label}
              </dt>
              <dd className="truncate text-sm text-white/80">{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
