// ─── Deals & Pipeline Domain Types ─────────────────────────────────────────
// Matches the SDD database-map.md `deals` schema and pipeline conventions.

export type DealStage =
  | "prospecting"
  | "qualification"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export interface PipelineStageConfig {
  id: DealStage;
  name: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export interface Deal {
  id: string;
  title: string;
  account_id: string | null;
  account_name: string;
  lead_id?: string | null;
  deal_value_usd: number;
  annual_contract_value?: number | null;
  subscription_tier?: "starter" | "growth" | "enterprise" | null;
  contract_length_months?: number | null;
  discount_given_pct?: number | null;
  sales_cycle_days?: number | null;
  stage: DealStage;
  /** AI-predicted close probability (0.00 – 1.00) */
  deal_close_prob: number | null;
  deal_close_prob_scored_at?: string | null;
  expected_close_date: string | null; // ISO Date "YYYY-MM-DD"
  assigned_to: string | null; // Rep UUID
  owner_name: string;
  owner_avatar?: string | null;
  priority?: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  stages: PipelineStageConfig[];
}

export interface PipelineData {
  pipeline: Pipeline;
  deals: Deal[];
  summary: {
    total_deals: number;
    total_value_usd: number;
    weighted_value_usd: number;
    avg_close_prob: number;
  };
}

export interface UpdateDealStagePayload {
  dealId: string;
  sourceStage: DealStage;
  destinationStage: DealStage;
  newIndex?: number;
}
