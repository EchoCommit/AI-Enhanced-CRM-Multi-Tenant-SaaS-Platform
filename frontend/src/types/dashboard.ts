// ─── Dashboard Domain Types ────────────────────────────────────────────────
// All shapes mirror the SDD database-map.md schema exactly so swapping
// from mock data to real GraphQL / REST responses requires zero type changes.

/** Matches the `activities` table shape from the SDD */
export interface Activity {
  id: string;
  entity_type: "lead" | "deal" | "account";
  entity_id: string;
  /** Display name of the linked entity (joined, not stored in DB) */
  entity_name: string;
  type: "email" | "call" | "meeting";
  notes: string | null;
  duration_minutes: number | null;
  occurred_at: string; // ISO 8601
  logged_by: string; // UUID
  /** Display name of the user who logged it (joined) */
  logged_by_name: string;
  created_at: string; // ISO 8601
}

/** Aggregated pipeline summary — computed server-side / via API */
export interface PipelineSummary {
  deal_count: number;
  total_value_usd: number;
  avg_deal_size_usd: number;
  /** Trend vs. previous period (as a signed percentage, e.g. 12.5 = +12.5%) */
  deal_count_trend: number;
  total_value_trend: number;
  avg_deal_size_trend: number;
}

/** Single data-point for the revenue-over-time chart */
export interface RevenueDataPoint {
  /** Human-readable label, e.g. "Jan '25" */
  month: string;
  /** Total deal value closed in USD */
  revenue: number;
  /** Total deal value in pipeline (not yet closed) */
  pipeline: number;
}

/** Full payload returned by the dashboard API / hook */
export interface DashboardData {
  pipeline: PipelineSummary;
  revenueOverTime: RevenueDataPoint[];
  recentActivities: Activity[];
}
