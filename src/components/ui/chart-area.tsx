"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const AXIS_STYLE = {
  fontSize: 12,
  fill: "#ffffff66",
}

const GRID_STROKE = "#ffffff0f"

interface ChartAreaProps {
  /** Array of data objects */
  data: Record<string, unknown>[]
  /** Key in data for the X axis (category axis) */
  xAxisKey: string
  /** Key(s) in data for the area values — string or array for multiple areas */
  dataKey: string | string[]
  /** Chart height in pixels (default 300) */
  height?: number
  /** Optional className for the outer wrapper */
  className?: string
  /** Whether to stack multiple areas (default false) */
  stacked?: boolean
}

function ChartAreaTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a2e] px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-white/50">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-medium text-white">
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {entry.value.toLocaleString("en-US")}
        </p>
      ))}
    </div>
  )
}

const COLORS = [
  "var(--brand-primary)",
  "var(--brand-accent)",
  "var(--brand-info, #3b82f6)",
  "var(--brand-success, #22c55e)",
]

function ChartArea({
  data,
  xAxisKey,
  dataKey,
  height = 300,
  className,
  stacked = false,
}: ChartAreaProps) {
  const keys = Array.isArray(dataKey) ? dataKey : [dataKey]

  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            {keys.map((key, i) => (
              <linearGradient
                key={key}
                id={`area-gradient-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={COLORS[i % COLORS.length]}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={COLORS[i % COLORS.length]}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
          <XAxis dataKey={xAxisKey} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartAreaTooltip />} />
          {keys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId={stacked ? "stack" : undefined}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              fill={`url(#area-gradient-${key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export { ChartArea }
export type { ChartAreaProps }
