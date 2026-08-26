"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { PipelineSummaryCards } from "./PipelineSummaryCards";
import { RevenueChart } from "./RevenueChart";
import { ActivityFeed } from "./ActivityFeed";

// ─── Skeleton placeholders ──────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-card p-5 shadow-sm animate-pulse">
      <div className="h-4 w-32 rounded bg-muted/40 mb-3" />
      <div className="h-9 w-24 rounded bg-muted/40 mb-3" />
      <div className="h-4 w-20 rounded bg-muted/40" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-card p-5 shadow-sm animate-pulse">
      <div className="h-4 w-48 rounded bg-muted/40 mb-2" />
      <div className="h-3 w-64 rounded bg-muted/30 mb-6" />
      <div className="h-[280px] rounded-xl bg-muted/20" />
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-card p-5 shadow-sm animate-pulse space-y-4">
      <div className="h-4 w-36 rounded bg-muted/40" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="h-7 w-7 rounded-lg bg-muted/40 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-48 rounded bg-muted/40" />
            <div className="h-3 w-full rounded bg-muted/30" />
            <div className="h-3 w-24 rounded bg-muted/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Error state ─────────────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
      <strong>Failed to load dashboard data</strong>
      <p className="mt-1 text-xs text-red-400/70">{message}</p>
    </div>
  );
}

// ─── Client orchestrator ─────────────────────────────────────────────────────

export function DashboardClient() {
  const { data, isLoading, isError, error } = useDashboardData();

  if (isError) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ErrorBanner message={error?.message ?? "Unknown error"} />
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Pipeline KPI cards ────────────────────────────── */}
      {isLoading || !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <PipelineSummaryCards summary={data.pipeline} />
      )}

      {/* ── Revenue chart + Activity feed ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          {isLoading || !data ? (
            <ChartSkeleton />
          ) : (
            <RevenueChart data={data.revenueOverTime} />
          )}
        </div>
        <div className="lg:col-span-2">
          {isLoading || !data ? (
            <FeedSkeleton />
          ) : (
            <ActivityFeed activities={data.recentActivities} />
          )}
        </div>
      </div>
    </div>
  );
}
