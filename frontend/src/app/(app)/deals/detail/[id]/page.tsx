/**
 * Deal Detail Page — Placeholder
 *
 * Route target for navigation from deal cards in the Kanban board.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, DollarSign, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Deal Detail · Nexus CRM",
};

interface DealDetailPageProps {
  params: { id: string };
}

export default function DealDetailPage({ params }: DealDetailPageProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Back link to pipeline */}
      <Link
        href="/deals/sales-pipeline"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Pipeline
      </Link>

      {/* Placeholder card */}
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 flex flex-col items-center justify-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <DollarSign className="h-7 w-7" />
        </span>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Deal Overview & AI Close Probability
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-2.5 w-2.5" />
              AI Scored
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Placeholder for deal{" "}
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              {params.id}
            </code>
            . The full detail view with activity timelines, contact associations,
            and predictive churn/win factors will be rendered here.
          </p>
        </div>
      </div>
    </div>
  );
}
