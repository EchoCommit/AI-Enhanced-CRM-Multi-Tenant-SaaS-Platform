/**
 * Deals & Pipeline TanStack Query Hooks
 *
 * Provides `usePipelineDeals` for fetching and `useUpdateDealStage` for
 * optimistic drag-and-drop updates.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPipelineDeals, updateDealStage } from "@/lib/mockDealsApi";
import type { DealStage, PipelineData, UpdateDealStagePayload } from "@/types/deals";

export const DEALS_QUERY_KEY = "pipeline-deals";

/**
 * Hook to fetch pipeline data and its constituent deals.
 */
export function usePipelineDeals(pipelineId: string = "sales-pipeline") {
  return useQuery<PipelineData>({
    queryKey: [DEALS_QUERY_KEY, pipelineId],
    queryFn: () => fetchPipelineDeals(pipelineId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Optimistic mutation hook for drag-and-drop stage updates.
 * Moves the card immediately in the TanStack Query cache without waiting
 * for the server response, rolling back automatically on network error.
 */
export function useUpdateDealStage(pipelineId: string = "sales-pipeline") {
  const queryClient = useQueryClient();
  const queryKey = [DEALS_QUERY_KEY, pipelineId];

  return useMutation({
    mutationFn: ({ dealId, destinationStage, newIndex }: UpdateDealStagePayload) =>
      updateDealStage(dealId, destinationStage, newIndex),

    // ── Optimistic update ───────────────────────────────────────────────────
    onMutate: async ({ dealId, destinationStage }: UpdateDealStagePayload) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous query data
      const previousData = queryClient.getQueryData<PipelineData>(queryKey);

      if (previousData) {
        // Optimistically calculate new stage and updated deals array
        const updatedDeals = previousData.deals.map((deal) => {
          if (deal.id === dealId) {
            let updatedProb = deal.deal_close_prob;
            if (destinationStage === "closed_won") updatedProb = 1.0;
            else if (destinationStage === "closed_lost") updatedProb = 0.0;
            else if (destinationStage === "negotiation" && (updatedProb ?? 0) < 0.75)
              updatedProb = 0.82;
            else if (destinationStage === "proposal" && (updatedProb ?? 0) < 0.55)
              updatedProb = 0.65;
            else if (destinationStage === "qualification" && (updatedProb ?? 0) < 0.35)
              updatedProb = 0.48;

            return {
              ...deal,
              stage: destinationStage as DealStage,
              deal_close_prob: updatedProb,
              updated_at: new Date().toISOString(),
            };
          }
          return deal;
        });

        // Recompute summary metrics optimistically
        const totalValue = updatedDeals.reduce((sum, d) => sum + d.deal_value_usd, 0);
        const weightedValue = updatedDeals.reduce(
          (sum, d) => sum + d.deal_value_usd * (d.deal_close_prob ?? 0.5),
          0
        );
        const avgProb =
          updatedDeals.length > 0
            ? updatedDeals.reduce((sum, d) => sum + (d.deal_close_prob ?? 0), 0) /
              updatedDeals.length
            : 0;

        queryClient.setQueryData<PipelineData>(queryKey, {
          ...previousData,
          deals: updatedDeals,
          summary: {
            total_deals: updatedDeals.length,
            total_value_usd: totalValue,
            weighted_value_usd: Math.round(weightedValue),
            avg_close_prob: avgProb,
          },
        });
      }

      // Return context with snapshotted previousData for rollback
      return { previousData };
    },

    // ── Rollback on error ───────────────────────────────────────────────────
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    // ── Settle / synchronize ────────────────────────────────────────────────
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
