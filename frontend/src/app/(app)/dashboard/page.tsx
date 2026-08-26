/**
 * Dashboard Page — Server Component Shell
 *
 * This file intentionally has NO "use client" directive.  It renders static
 * chrome (heading, breadcrumb, metadata) on the server and delegates all
 * interactive / data-fetching work to <DashboardClient />, a Client Component.
 *
 * Pattern: Server Component shell  +  Client island(s)
 * ──────────────────────────────────────────────────────
 * - Static HTML is streamed immediately (zero JS cost).
 * - The client island mounts, fires the TanStack Query hook, shows skeletons
 *   while loading, then paints the live data — all without a full-page
 *   client re-render.
 */

import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import { DashboardClient } from "./_components/DashboardClient";

// ─── SEO ─────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Dashboard · Nexus CRM",
  description:
    "Pipeline summary, revenue trends, and recent activity for your Nexus CRM workspace.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header — rendered server-side, zero client JS */}
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LayoutDashboard className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Pipeline health, revenue trends &amp; latest team activity
          </p>
        </div>
      </div>

      {/*
       * Client island — owns all interactive + data-fetching work.
       * Renders skeleton loaders while the TanStack Query hook resolves.
       */}
      <DashboardClient />
    </div>
  );
}
