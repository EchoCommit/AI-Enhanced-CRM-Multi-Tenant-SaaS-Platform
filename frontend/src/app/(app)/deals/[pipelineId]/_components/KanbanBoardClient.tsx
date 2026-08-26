"use client";

import React, { useState, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  Search,
  Filter,
  Layers,
  Plus,
  DollarSign,
  TrendingUp,
  Percent,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DealCard } from "@/components/domain/DealCard";
import { usePipelineDeals, useUpdateDealStage } from "@/hooks/useDeals";
import type { Deal, DealStage, PipelineStageConfig } from "@/types/deals";

interface KanbanBoardClientProps {
  pipelineId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrencyShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}k`;
  }
  return `$${amount.toLocaleString()}`;
}

// ─── Kanban Board Island ──────────────────────────────────────────────────────

export function KanbanBoardClient({ pipelineId }: KanbanBoardClientProps) {
  const { data, isLoading, isError, error } = usePipelineDeals(pipelineId);
  const updateStageMutation = useUpdateDealStage(pipelineId);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<string>("all");

  // Extract available unique owners for filtering
  const owners = useMemo(() => {
    if (!data?.deals) return [];
    const set = new Set<string>();
    data.deals.forEach((d) => {
      if (d.owner_name) set.add(d.owner_name);
    });
    return Array.from(set);
  }, [data?.deals]);

  // Filtered deals
  const filteredDeals = useMemo(() => {
    if (!data?.deals) return [];
    return data.deals.filter((deal) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.account_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOwner =
        selectedOwner === "all" || deal.owner_name === selectedOwner;

      return matchesSearch && matchesOwner;
    });
  }, [data?.deals, searchQuery, selectedOwner]);

  // Deals grouped by stage
  const dealsByStage = useMemo(() => {
    const map: Record<DealStage, Deal[]> = {
      prospecting: [],
      qualification: [],
      proposal: [],
      negotiation: [],
      closed_won: [],
      closed_lost: [],
    };

    filteredDeals.forEach((deal) => {
      if (map[deal.stage]) {
        map[deal.stage].push(deal);
      }
    });

    return map;
  }, [filteredDeals]);

  // Handle Drag and Drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside or in same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const sourceStage = source.droppableId as DealStage;
    const destinationStage = destination.droppableId as DealStage;

    // Optimistically trigger mutation via TanStack Query
    updateStageMutation.mutate({
      dealId: draggableId,
      sourceStage,
      destinationStage,
      newIndex: destination.index,
    });
  };

  // Loading state skeleton
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-card border border-border/50 p-4"
            />
          ))}
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-72 shrink-0 rounded-2xl bg-card border border-border/50 h-[520px] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center flex flex-col items-center gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-foreground">
          Failed to load pipeline data
        </p>
        <p className="text-xs text-muted-foreground">
          {(error as Error)?.message || "Please try refreshing the page."}
        </p>
      </div>
    );
  }

  const stages: PipelineStageConfig[] =
    data?.pipeline.stages || [];
  const summary = data?.summary || {
    total_deals: 0,
    total_value_usd: 0,
    weighted_value_usd: 0,
    avg_close_prob: 0,
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* ── Metric Summary Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Pipeline */}
        <div className="rounded-xl border border-border/60 bg-card p-3.5 flex items-center gap-3 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Total Value
            </p>
            <p className="text-lg font-bold text-foreground truncate">
              {formatCurrencyShort(summary.total_value_usd)}
            </p>
          </div>
        </div>

        {/* Weighted Pipeline */}
        <div className="rounded-xl border border-border/60 bg-card p-3.5 flex items-center gap-3 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Weighted Value
            </p>
            <p className="text-lg font-bold text-foreground truncate">
              {formatCurrencyShort(summary.weighted_value_usd)}
            </p>
          </div>
        </div>

        {/* Active Deals */}
        <div className="rounded-xl border border-border/60 bg-card p-3.5 flex items-center gap-3 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Total Deals
            </p>
            <p className="text-lg font-bold text-foreground truncate">
              {summary.total_deals}
            </p>
          </div>
        </div>

        {/* AI Avg Win Prob */}
        <div className="rounded-xl border border-border/60 bg-card p-3.5 flex items-center gap-3 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Avg AI Win Prob
            </p>
            <p className="text-lg font-bold text-foreground truncate">
              {Math.round(summary.avg_close_prob * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search & Rep Filter ────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px] max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              id="deals-search"
              placeholder="Search deal name or company…"
              className="pl-8 h-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Reps</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {updateStageMutation.isPending && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full border border-border/40">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span>Saving stage…</span>
            </div>
          )}
          <Button size="sm" className="h-9 gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* ── Drag & Drop Kanban Columns ──────────────────────────────────── */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 min-h-[580px] items-start">
          {stages.map((stage) => {
            const stageDeals = dealsByStage[stage.id] || [];
            const stageTotalValue = stageDeals.reduce(
              (sum, d) => sum + d.deal_value_usd,
              0
            );

            return (
              <div
                key={stage.id}
                className="w-72 sm:w-80 shrink-0 flex flex-col rounded-2xl border border-border/60 bg-muted/20 shadow-2xs overflow-hidden"
              >
                {/* Stage Header */}
                <div className="p-3 border-b border-border/50 bg-card/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="text-xs font-bold text-foreground truncate">
                      {stage.name}
                    </h3>
                    <span className="flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">
                      {stageDeals.length}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {formatCurrencyShort(stageTotalValue)}
                  </span>
                </div>

                {/* Stage Droppable Area */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-col gap-2.5 p-2.5 min-h-[460px] max-h-[calc(100vh-280px)] overflow-y-auto transition-colors duration-150 ${
                        snapshot.isDraggingOver
                          ? "bg-primary/5 ring-1 ring-primary/20 rounded-b-2xl"
                          : ""
                      }`}
                    >
                      {stageDeals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-44 rounded-xl border border-dashed border-border/60 p-4 text-center text-muted-foreground">
                          <p className="text-[11px] font-medium">No deals</p>
                          <p className="text-[10px] opacity-60 mt-0.5">
                            Drag deals here to advance stage
                          </p>
                        </div>
                      ) : (
                        stageDeals.map((deal, index) => (
                          <Draggable
                            key={deal.id}
                            draggableId={deal.id}
                            index={index}
                          >
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                style={dragProvided.draggableProps.style}
                              >
                                <DealCard
                                  deal={deal}
                                  isDragging={dragSnapshot.isDragging}
                                  dragHandleProps={dragProvided.dragHandleProps}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
