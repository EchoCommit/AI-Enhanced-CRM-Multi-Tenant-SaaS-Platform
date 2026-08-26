/**
 * Mock Deals & Pipeline API
 *
 * Structure: The exported `fetchPipelineDeals` and `updateDealStage` functions
 * are the single integration points called by the TanStack Query hooks.
 * To point to the real FastAPI / GraphQL backend, replace the body of these functions.
 */

import type {
  Deal,
  DealStage,
  Pipeline,
  PipelineData,
  PipelineStageConfig,
} from "@/types/deals";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Default Pipeline Stages ──────────────────────────────────────────────────

export const DEFAULT_PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    id: "prospecting",
    name: "Prospecting",
    color: "#6366f1", // Indigo
    badgeBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    description: "Initial discovery & outreach leads",
  },
  {
    id: "qualification",
    name: "Qualification",
    color: "#06b6d4", // Cyan
    badgeBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    description: "BANT qualification & technical fit assessment",
  },
  {
    id: "proposal",
    name: "Proposal",
    color: "#8b5cf6", // Violet
    badgeBg: "bg-violet-500/10 dark:bg-violet-500/20",
    badgeText: "text-violet-600 dark:text-violet-400",
    description: "Formal solution pitch & commercial proposal sent",
  },
  {
    id: "negotiation",
    name: "Negotiation",
    color: "#f59e0b", // Amber
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/20",
    badgeText: "text-amber-600 dark:text-amber-400",
    description: "Contract legal review & pricing adjustments",
  },
  {
    id: "closed_won",
    name: "Closed Won",
    color: "#10b981", // Emerald
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    description: "Signed contract & onboarding kicked off",
  },
  {
    id: "closed_lost",
    name: "Closed Lost",
    color: "#ef4444", // Rose/Red
    badgeBg: "bg-rose-500/10 dark:bg-rose-500/20",
    badgeText: "text-rose-600 dark:text-rose-400",
    description: "Deal disqualified or lost to competitor",
  },
];

export const DEFAULT_PIPELINE: Pipeline = {
  id: "sales-pipeline",
  name: "Enterprise Sales Pipeline",
  description: "Standard B2B Enterprise high-velocity sales motion",
  is_default: true,
  stages: DEFAULT_PIPELINE_STAGES,
};

// ─── In-Memory Seed Deals ─────────────────────────────────────────────────────

let mockDealsStore: Deal[] = [
  // Prospecting
  {
    id: "deal-001",
    title: "Apex Global Cloud Migration",
    account_id: "acc-001",
    account_name: "Apex Global Logistics",
    deal_value_usd: 85_000,
    annual_contract_value: 85_000,
    subscription_tier: "enterprise",
    stage: "prospecting",
    deal_close_prob: 0.28,
    deal_close_prob_scored_at: "2025-08-25T11:20:00Z",
    expected_close_date: "2025-11-30",
    assigned_to: "usr-001",
    owner_name: "Sarah Chen",
    priority: "medium",
    created_at: "2025-08-10T09:15:00Z",
    updated_at: "2025-08-20T14:30:00Z",
  },
  {
    id: "deal-002",
    title: "Vanguard Tech AI Pilot",
    account_id: "acc-002",
    account_name: "Vanguard Technologies",
    deal_value_usd: 42_000,
    annual_contract_value: 42_000,
    subscription_tier: "growth",
    stage: "prospecting",
    deal_close_prob: 0.35,
    deal_close_prob_scored_at: "2025-08-26T08:00:00Z",
    expected_close_date: "2025-10-15",
    assigned_to: "usr-002",
    owner_name: "Marcus Brody",
    priority: "high",
    created_at: "2025-08-14T10:00:00Z",
    updated_at: "2025-08-22T16:00:00Z",
  },
  {
    id: "deal-003",
    title: "Horizon Health Security Suite",
    account_id: "acc-006",
    account_name: "Horizon Health",
    deal_value_usd: 30_000,
    annual_contract_value: 30_000,
    subscription_tier: "starter",
    stage: "prospecting",
    deal_close_prob: 0.22,
    deal_close_prob_scored_at: "2025-08-24T09:40:00Z",
    expected_close_date: "2025-12-15",
    assigned_to: "usr-003",
    owner_name: "Elena Rostova",
    priority: "low",
    created_at: "2025-08-18T13:45:00Z",
    updated_at: "2025-08-24T09:40:00Z",
  },

  // Qualification
  {
    id: "deal-004",
    title: "Starlight Media Multi-Seat License",
    account_id: "acc-003",
    account_name: "Starlight Media Group",
    deal_value_usd: 64_000,
    annual_contract_value: 64_000,
    subscription_tier: "growth",
    stage: "qualification",
    deal_close_prob: 0.54,
    deal_close_prob_scored_at: "2025-08-26T07:15:00Z",
    expected_close_date: "2025-10-31",
    assigned_to: "usr-001",
    owner_name: "Sarah Chen",
    priority: "high",
    created_at: "2025-08-05T11:00:00Z",
    updated_at: "2025-08-23T15:20:00Z",
  },
  {
    id: "deal-005",
    title: "BlueWave FinTech SOC2 Expansion",
    account_id: "acc-007",
    account_name: "BlueWave Financial",
    deal_value_usd: 120_000,
    annual_contract_value: 120_000,
    subscription_tier: "enterprise",
    stage: "qualification",
    deal_close_prob: 0.61,
    deal_close_prob_scored_at: "2025-08-25T14:10:00Z",
    expected_close_date: "2025-11-15",
    assigned_to: "usr-004",
    owner_name: "Devon Vance",
    priority: "high",
    created_at: "2025-07-28T09:30:00Z",
    updated_at: "2025-08-25T14:10:00Z",
  },

  // Proposal
  {
    id: "deal-006",
    title: "Nexus BioResearch Platform Tier",
    account_id: "acc-004",
    account_name: "Nexus BioResearch",
    deal_value_usd: 185_000,
    annual_contract_value: 185_000,
    subscription_tier: "enterprise",
    stage: "proposal",
    deal_close_prob: 0.76,
    deal_close_prob_scored_at: "2025-08-26T10:00:00Z",
    expected_close_date: "2025-09-30",
    assigned_to: "usr-001",
    owner_name: "Sarah Chen",
    priority: "high",
    created_at: "2025-07-15T08:00:00Z",
    updated_at: "2025-08-26T10:00:00Z",
  },
  {
    id: "deal-007",
    title: "Quantum Robotics Dev Hub",
    account_id: "acc-005",
    account_name: "Quantum Robotics Labs",
    deal_value_usd: 95_000,
    annual_contract_value: 95_000,
    subscription_tier: "growth",
    stage: "proposal",
    deal_close_prob: 0.68,
    deal_close_prob_scored_at: "2025-08-26T09:30:00Z",
    expected_close_date: "2025-10-10",
    assigned_to: "usr-002",
    owner_name: "Marcus Brody",
    priority: "medium",
    created_at: "2025-07-20T14:15:00Z",
    updated_at: "2025-08-21T11:00:00Z",
  },

  // Negotiation
  {
    id: "deal-008",
    title: "Solaria Energy Smart Grid CRM",
    account_id: "acc-008",
    account_name: "Solaria Energy Corp",
    deal_value_usd: 210_000,
    annual_contract_value: 210_000,
    subscription_tier: "enterprise",
    stage: "negotiation",
    deal_close_prob: 0.88,
    deal_close_prob_scored_at: "2025-08-26T12:00:00Z",
    expected_close_date: "2025-09-15",
    assigned_to: "usr-004",
    owner_name: "Devon Vance",
    priority: "high",
    created_at: "2025-06-25T10:00:00Z",
    updated_at: "2025-08-26T12:00:00Z",
  },
  {
    id: "deal-009",
    title: "Zenith Retail Omnichannel Suite",
    account_id: "acc-009",
    account_name: "Zenith Retail Brands",
    deal_value_usd: 145_000,
    annual_contract_value: 145_000,
    subscription_tier: "enterprise",
    stage: "negotiation",
    deal_close_prob: 0.82,
    deal_close_prob_scored_at: "2025-08-25T16:30:00Z",
    expected_close_date: "2025-09-22",
    assigned_to: "usr-003",
    owner_name: "Elena Rostova",
    priority: "medium",
    created_at: "2025-07-02T13:00:00Z",
    updated_at: "2025-08-25T16:30:00Z",
  },

  // Closed Won
  {
    id: "deal-010",
    title: "Nova Telecom Core Upgrade",
    account_id: "acc-010",
    account_name: "Nova Telecom",
    deal_value_usd: 350_000,
    annual_contract_value: 350_000,
    subscription_tier: "enterprise",
    stage: "closed_won",
    deal_close_prob: 1.0,
    deal_close_prob_scored_at: "2025-08-20T18:00:00Z",
    expected_close_date: "2025-08-20",
    assigned_to: "usr-001",
    owner_name: "Sarah Chen",
    priority: "high",
    created_at: "2025-05-12T09:00:00Z",
    updated_at: "2025-08-20T18:00:00Z",
  },
  {
    id: "deal-011",
    title: "OmniHealth Regional Expansion",
    account_id: "acc-011",
    account_name: "OmniHealth Systems",
    deal_value_usd: 175_000,
    annual_contract_value: 175_000,
    subscription_tier: "growth",
    stage: "closed_won",
    deal_close_prob: 1.0,
    deal_close_prob_scored_at: "2025-08-15T15:00:00Z",
    expected_close_date: "2025-08-15",
    assigned_to: "usr-002",
    owner_name: "Marcus Brody",
    priority: "medium",
    created_at: "2025-06-01T11:20:00Z",
    updated_at: "2025-08-15T15:00:00Z",
  },

  // Closed Lost
  {
    id: "deal-012",
    title: "AeroDynamics CAD Integration",
    account_id: "acc-012",
    account_name: "AeroDynamics Global",
    deal_value_usd: 90_000,
    annual_contract_value: 90_000,
    subscription_tier: "enterprise",
    stage: "closed_lost",
    deal_close_prob: 0.0,
    deal_close_prob_scored_at: "2025-08-18T10:00:00Z",
    expected_close_date: "2025-08-18",
    assigned_to: "usr-004",
    owner_name: "Devon Vance",
    priority: "low",
    created_at: "2025-06-10T14:00:00Z",
    updated_at: "2025-08-18T10:00:00Z",
  },
];

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetch pipeline details and all deals belonging to the pipeline.
 * One-line swap point for real GET /api/v1/deals?pipeline_id=... endpoint.
 */
export async function fetchPipelineDeals(
  pipelineId: string = "sales-pipeline"
): Promise<PipelineData> {
  await delay(180); // Fast simulated latency

  const pipeline = {
    ...DEFAULT_PIPELINE,
    id: pipelineId || "sales-pipeline",
  };

  const totalDeals = mockDealsStore.length;
  const totalValue = mockDealsStore.reduce((sum, d) => sum + d.deal_value_usd, 0);
  const weightedValue = mockDealsStore.reduce(
    (sum, d) => sum + d.deal_value_usd * (d.deal_close_prob ?? 0.5),
    0
  );
  const avgProb =
    totalDeals > 0
      ? mockDealsStore.reduce((sum, d) => sum + (d.deal_close_prob ?? 0), 0) /
        totalDeals
      : 0;

  return {
    pipeline,
    deals: [...mockDealsStore],
    summary: {
      total_deals: totalDeals,
      total_value_usd: totalValue,
      weighted_value_usd: Math.round(weightedValue),
      avg_close_prob: avgProb,
    },
  };
}

/**
 * Update a deal's stage (called on Kanban drag-and-drop).
 * One-line swap point for real PATCH /api/v1/deals/{id}/stage endpoint.
 */
export async function updateDealStage(
  dealId: string,
  newStage: DealStage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  newIndex?: number
): Promise<Deal> {
  await delay(120);

  const dealIndex = mockDealsStore.findIndex((d) => d.id === dealId);
  if (dealIndex === -1) {
    throw new Error(`Deal with id ${dealId} not found`);
  }

  // Update probability heuristics based on target stage if needed
  let updatedProb = mockDealsStore[dealIndex].deal_close_prob;
  if (newStage === "closed_won") updatedProb = 1.0;
  else if (newStage === "closed_lost") updatedProb = 0.0;
  else if (newStage === "negotiation" && (updatedProb ?? 0) < 0.75) updatedProb = 0.82;
  else if (newStage === "proposal" && (updatedProb ?? 0) < 0.55) updatedProb = 0.65;
  else if (newStage === "qualification" && (updatedProb ?? 0) < 0.35) updatedProb = 0.48;

  const updatedDeal: Deal = {
    ...mockDealsStore[dealIndex],
    stage: newStage,
    deal_close_prob: updatedProb,
    updated_at: new Date().toISOString(),
  };

  mockDealsStore[dealIndex] = updatedDeal;
  return updatedDeal;
}
