"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { PipelineSummary } from "@/types/dashboard";

// ─── helpers ───────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 1_000_000)
    return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000)
    return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

function TrendBadge({ pct }: { pct: number }) {
  const positive = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        positive
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {positive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {positive ? "+" : ""}
      {pct.toFixed(1)}%
    </span>
  );
}

// ─── Individual card ────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  subtitle: string;
  accentColor: string;
}

function StatCard({ title, value, trend, subtitle, accentColor }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-card p-5 shadow-sm flex flex-col gap-3">
      {/* accent stripe */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
        style={{ background: accentColor }}
      />
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
      <div className="flex items-center gap-2">
        <TrendBadge pct={trend} />
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </div>
  );
}

// ─── Island component ───────────────────────────────────────────────────────

interface PipelineSummaryCardsProps {
  summary: PipelineSummary;
}

export function PipelineSummaryCards({ summary }: PipelineSummaryCardsProps) {
  const cards: StatCardProps[] = [
    {
      title: "Active Deals",
      value: summary.deal_count.toString(),
      trend: summary.deal_count_trend,
      subtitle: "vs. last period",
      accentColor: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    },
    {
      title: "Total Pipeline Value",
      value: formatCurrency(summary.total_value_usd),
      trend: summary.total_value_trend,
      subtitle: "vs. last period",
      accentColor: "linear-gradient(90deg, #06b6d4, #0ea5e9)",
    },
    {
      title: "Avg. Deal Size",
      value: formatCurrency(summary.avg_deal_size_usd),
      trend: summary.avg_deal_size_trend,
      subtitle: "vs. last period",
      accentColor: "linear-gradient(90deg, #f59e0b, #f97316)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
