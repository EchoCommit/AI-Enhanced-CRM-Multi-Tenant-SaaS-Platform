/**
 * useDashboardData
 *
 * TanStack Query hook that fetches all data needed for the dashboard page.
 * The only import you need to change when wiring up the real API is the
 * `fetchDashboardData` import below — every consumer stays the same.
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardData } from "@/types/dashboard";

// ⬇️  ONE LINE CHANGE: replace this import with your real GraphQL fetcher
import { fetchDashboardData } from "@/lib/mockDashboardApi";

export const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export function useDashboardData() {
  return useQuery<DashboardData, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: fetchDashboardData,
    // Refresh every 5 minutes while the window is focused
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
