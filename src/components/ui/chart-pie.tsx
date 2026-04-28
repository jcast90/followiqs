"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ChartPieProps {
  /** Array of data objects — each should have a name/label key and a value key */
  data: Record<string, unknown>[]
  /** Key in data for the slice values */
  dataKey: string
  /** Key in data for the slice labels (default "name") */
  nameKey?: string
  /** Chart height in pixels (default 300) */
  height?: number
  /** Optional className for the outer wrapper */
  className?: string
  /** Inner radius for donut style (default 0 = full pie) */
  innerRadius?: number
  /** Outer radius (default 100) */
  outerRadius?: number
  /** Whether to show the legend (default true) */
  showLegend?: boolean
}

function ChartPieTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number; payload: { fill: string } }[]
}) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a2e] px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-white">
        <span
          className="mr-2 inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: entry.payload.fill }}
        />
        {entry.name}: {entry.value.toLocaleString("en-US")}
      </p>
    </div>
  )
}

const COLORS = [
  "var(--brand-primary)",
  "var(--brand-accent)",
  "var(--brand-info, #3b82f6)",
  "var(--brand-success, #22c55e)",
  "var(--brand-warning, #eab308)",
  "var(--brand-error, #ef4444)",
  "var(--brand-muted, #6b7280)",
  "#a78bfa",
]

function ChartPie({
  data,
  dataKey,
  nameKey = "name",
  height = 300,
  className,
  innerRadius = 0,
  outerRadius = 100,
  showLegend = true,
}: ChartPieProps) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartPieTooltip />} />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              formatter={(value: string) => (
                <span className="text-xs text-white/60">{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export { ChartPie }
export type { ChartPieProps }
