/**
 * Deals Pipeline Kanban Board — Server Component Shell
 *
 * Renders static server chrome (page header, breadcrumbs, metadata).
 * <KanbanBoardClient /> is the interactive client island that owns
 * TanStack Query data fetching, optimistic drag-and-drop state, and filtering.
 */

import type { Metadata } from "next";
import { GitBranch, Sparkles } from "lucide-react";
import { KanbanBoardClient } from "./_components/KanbanBoardClient";

export const metadata: Metadata = {
  title: "Deals Pipeline · Nexus CRM",
  description:
    "Interactive Kanban pipeline board with AI deal close probability and stage progression.",
};

interface DealsPipelinePageProps {
  params: {
    pipelineId: string;
  };
}

export default function DealsPipelinePage({ params }: DealsPipelinePageProps) {
  const pipelineId = params.pipelineId || "sales-pipeline";

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* ── Server-Rendered Page Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GitBranch className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Enterprise Sales Pipeline
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Sparkles className="h-2.5 w-2.5" />
                AI Scored
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Drag-and-drop deals across stages with instant optimistic sync
            </p>
          </div>
        </div>
      </div>

      {/* ── Interactive Client Island (Kanban Board) ────────────────────── */}
      <KanbanBoardClient pipelineId={pipelineId} />
    </div>
  );
}
