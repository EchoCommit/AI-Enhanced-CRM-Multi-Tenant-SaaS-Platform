/**
 * Mock Dashboard API
 *
 * Structure: the exported `fetchDashboardData` function is the ONLY thing the
 * TanStack Query hook calls.  To swap in the real GraphQL endpoint later,
 * replace this one function body — the hook and all components stay unchanged.
 */
import type { DashboardData } from "@/types/dashboard";

// ─── Simulated network delay ───────────────────────────────────────────────
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_DATA: DashboardData = {
  pipeline: {
    deal_count: 48,
    total_value_usd: 1_842_500,
    avg_deal_size_usd: 38_385,
    deal_count_trend: 8.3,
    total_value_trend: 14.7,
    avg_deal_size_trend: -2.1,
  },

  revenueOverTime: [
    { month: "Sep '24", revenue: 128_000, pipeline: 310_000 },
    { month: "Oct '24", revenue: 195_000, pipeline: 420_000 },
    { month: "Nov '24", revenue: 162_000, pipeline: 395_000 },
    { month: "Dec '24", revenue: 241_000, pipeline: 510_000 },
    { month: "Jan '25", revenue: 183_000, pipeline: 467_000 },
    { month: "Feb '25", revenue: 217_000, pipeline: 530_000 },
    { month: "Mar '25", revenue: 298_000, pipeline: 645_000 },
    { month: "Apr '25", revenue: 274_000, pipeline: 598_000 },
    { month: "May '25", revenue: 312_000, pipeline: 710_000 },
    { month: "Jun '25", revenue: 356_000, pipeline: 780_000 },
    { month: "Jul '25", revenue: 389_000, pipeline: 820_000 },
    { month: "Aug '25", revenue: 421_000, pipeline: 890_000 },
  ],

  recentActivities: [
    {
      id: "act-001",
      entity_type: "deal",
      entity_id: "deal-101",
      entity_name: "Acme Corp – Enterprise Plan",
      type: "call",
      notes: "Discussed Q4 pricing and next steps. Decision expected by Friday.",
      duration_minutes: 42,
      occurred_at: "2025-08-26T14:30:00Z",
      logged_by: "user-001",
      logged_by_name: "Sarah Chen",
      created_at: "2025-08-26T14:45:00Z",
    },
    {
      id: "act-002",
      entity_type: "lead",
      entity_id: "lead-202",
      entity_name: "Bright Future Inc",
      type: "email",
      notes: "Sent follow-up with product deck after initial demo.",
      duration_minutes: null,
      occurred_at: "2025-08-26T12:10:00Z",
      logged_by: "user-002",
      logged_by_name: "Marcus Webb",
      created_at: "2025-08-26T12:11:00Z",
    },
    {
      id: "act-003",
      entity_type: "account",
      entity_id: "acc-303",
      entity_name: "TechVault Ltd",
      type: "meeting",
      notes: "Quarterly business review — customer expressed interest in AI add-on.",
      duration_minutes: 60,
      occurred_at: "2025-08-26T10:00:00Z",
      logged_by: "user-001",
      logged_by_name: "Sarah Chen",
      created_at: "2025-08-26T11:05:00Z",
    },
    {
      id: "act-004",
      entity_type: "deal",
      entity_id: "deal-102",
      entity_name: "Pinnacle Health – Growth Tier",
      type: "email",
      notes: "Shared updated proposal with revised SLAs.",
      duration_minutes: null,
      occurred_at: "2025-08-25T16:55:00Z",
      logged_by: "user-003",
      logged_by_name: "Jordan Kim",
      created_at: "2025-08-25T16:58:00Z",
    },
    {
      id: "act-005",
      entity_type: "lead",
      entity_id: "lead-203",
      entity_name: "Greenfield Motors",
      type: "call",
      notes: "Cold outreach — left voicemail. Will try again Thursday.",
      duration_minutes: 3,
      occurred_at: "2025-08-25T15:20:00Z",
      logged_by: "user-002",
      logged_by_name: "Marcus Webb",
      created_at: "2025-08-25T15:21:00Z",
    },
    {
      id: "act-006",
      entity_type: "deal",
      entity_id: "deal-103",
      entity_name: "Orion Dynamics – Pro",
      type: "meeting",
      notes: "Technical evaluation session with their engineering team.",
      duration_minutes: 90,
      occurred_at: "2025-08-25T11:00:00Z",
      logged_by: "user-003",
      logged_by_name: "Jordan Kim",
      created_at: "2025-08-25T12:35:00Z",
    },
    {
      id: "act-007",
      entity_type: "account",
      entity_id: "acc-304",
      entity_name: "BlueStar Retail",
      type: "email",
      notes: "Checked in on onboarding progress — no blockers reported.",
      duration_minutes: null,
      occurred_at: "2025-08-24T17:30:00Z",
      logged_by: "user-001",
      logged_by_name: "Sarah Chen",
      created_at: "2025-08-24T17:31:00Z",
    },
    {
      id: "act-008",
      entity_type: "lead",
      entity_id: "lead-204",
      entity_name: "Nova Analytics",
      type: "call",
      notes: "Discovery call — strong fit, budget approved for next fiscal.",
      duration_minutes: 28,
      occurred_at: "2025-08-24T14:00:00Z",
      logged_by: "user-004",
      logged_by_name: "Priya Nair",
      created_at: "2025-08-24T14:30:00Z",
    },
    {
      id: "act-009",
      entity_type: "deal",
      entity_id: "deal-104",
      entity_name: "Summit Education – Enterprise",
      type: "email",
      notes: "Contract redline sent to legal. Awaiting signature.",
      duration_minutes: null,
      occurred_at: "2025-08-24T10:45:00Z",
      logged_by: "user-003",
      logged_by_name: "Jordan Kim",
      created_at: "2025-08-24T10:46:00Z",
    },
    {
      id: "act-010",
      entity_type: "account",
      entity_id: "acc-305",
      entity_name: "Meridian Logistics",
      type: "meeting",
      notes: "Renewal negotiation — upsell discussion for additional seats.",
      duration_minutes: 45,
      occurred_at: "2025-08-23T15:00:00Z",
      logged_by: "user-001",
      logged_by_name: "Sarah Chen",
      created_at: "2025-08-23T15:50:00Z",
    },
  ],
};

// ─── Exported fetcher — ONE LINE TO REPLACE with real GraphQL call ──────────

/**
 * Fetches dashboard data.
 *
 * ✅ CURRENT: returns deterministic mock data after a short artificial delay.
 *
 * 🔄 TO SWAP: replace the body of this function with a real GraphQL request:
 *   const res = await graphqlClient.request(DASHBOARD_QUERY, { tenantId });
 *   return transformDashboardResponse(res);
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  await delay(600); // simulate network latency
  return MOCK_DATA;
}
