"use client";

import { Mail, Phone, CalendarDays } from "lucide-react";
import type { Activity } from "@/types/dashboard";

// ─── helpers ────────────────────────────────────────────────────────────────

const ACTIVITY_ICON: Record<Activity["type"], React.ReactNode> = {
  email: <Mail className="h-3.5 w-3.5" />,
  call: <Phone className="h-3.5 w-3.5" />,
  meeting: <CalendarDays className="h-3.5 w-3.5" />,
};

const ACTIVITY_COLOR: Record<Activity["type"], string> = {
  email: "bg-blue-500/15 text-blue-400",
  call: "bg-emerald-500/15 text-emerald-400",
  meeting: "bg-violet-500/15 text-violet-400",
};

const ENTITY_BADGE_COLOR: Record<Activity["entity_type"], string> = {
  lead: "bg-amber-500/10 text-amber-400",
  deal: "bg-indigo-500/10 text-indigo-400",
  account: "bg-teal-500/10 text-teal-400",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Single row ─────────────────────────────────────────────────────────────

function ActivityRow({ activity: a }: { activity: Activity }) {
  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      {/* type icon bubble */}
      <span
        className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${ACTIVITY_COLOR[a.type]}`}
      >
        {ACTIVITY_ICON[a.type]}
      </span>

      <div className="min-w-0 flex-1">
        {/* entity name + badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-medium text-foreground truncate">
            {a.entity_name}
          </span>
          <span
            className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${ENTITY_BADGE_COLOR[a.entity_type]}`}
          >
            {a.entity_type}
          </span>
        </div>

        {/* notes */}
        {a.notes && (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {a.notes}
          </p>
        )}

        {/* footer: who + when */}
        <p className="mt-1 text-[11px] text-muted-foreground/70">
          {a.logged_by_name}
          {a.duration_minutes != null && ` · ${a.duration_minutes} min`}
          <span className="mx-1.5 opacity-40">·</span>
          {relativeTime(a.occurred_at)}
        </p>
      </div>
    </li>
  );
}

// ─── Island component ────────────────────────────────────────────────────────

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Recent Activity
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last {activities.length} interactions across your pipeline
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {activities.length}
        </span>
      </div>

      <ul className="divide-y divide-white/5">
        {activities.map((a) => (
          <ActivityRow key={a.id} activity={a} />
        ))}
      </ul>
    </div>
  );
}
