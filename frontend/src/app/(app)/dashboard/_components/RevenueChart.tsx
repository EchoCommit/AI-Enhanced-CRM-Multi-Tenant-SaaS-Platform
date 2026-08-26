"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { RevenueDataPoint } from "@/types/dashboard";

// ─── Custom tooltip ─────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(v);

  return (
    <div className="rounded-xl border border-white/10 bg-popover/90 backdrop-blur-sm p-3 shadow-xl text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="capitalize">{p.name}:</span>
          <span className="font-medium text-foreground">{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Island component ────────────────────────────────────────────────────────

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const yFormatter = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <div className="rounded-2xl border border-white/5 bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Revenue vs. Pipeline
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Closed revenue and active pipeline value — trailing 12 months
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={yFormatter}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              paddingTop: 8,
              color: "hsl(var(--muted-foreground))",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="pipeline"
            name="Pipeline"
            stroke="#06b6d4"
            strokeWidth={2.5}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
