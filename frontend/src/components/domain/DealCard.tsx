"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Building2,
  Calendar,
  DollarSign,
  User,
  GripVertical,
} from "lucide-react";
import type { Deal } from "@/types/deals";

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "No date";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getProbabilityBadge(prob: number | null) {
  if (prob === null) {
    return {
      text: "Unscored",
      color: "bg-muted/60 text-muted-foreground border-border/50",
    };
  }
  const pct = Math.round(prob * 100);
  if (pct >= 75) {
    return {
      text: `${pct}% Win`,
      color:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    };
  }
  if (pct >= 50) {
    return {
      text: `${pct}% Win`,
      color:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    };
  }
  return {
    text: `${pct}% Win`,
    color:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
}

function getOwnerInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

// ─── Deal Card Component ──────────────────────────────────────────────────────

export function DealCard({
  deal,
  isDragging = false,
  dragHandleProps,
}: DealCardProps) {
  const probBadge = getProbabilityBadge(deal.deal_close_prob);
  const initials = getOwnerInitials(deal.owner_name || "Unassigned");

  return (
    <div
      className={`group relative rounded-xl border bg-card/95 backdrop-blur-sm p-3.5 transition-all duration-200 select-none ${
        isDragging
          ? "border-primary shadow-2xl ring-2 ring-primary/20 scale-[1.02] rotate-1 z-50 opacity-95"
          : "border-border/60 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      {/* Top row: Account tag & Drag handle */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[140px]">
            {deal.account_name || "Independent"}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* AI Close Probability Badge */}
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border ${probBadge.color}`}
            title={`AI Close Probability: ${
              deal.deal_close_prob !== null
                ? `${Math.round(deal.deal_close_prob * 100)}%`
                : "Not Scored"
            }`}
          >
            <Sparkles className="h-2.5 w-2.5" />
            {probBadge.text}
          </span>

          {/* Drag handle icon */}
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-0.5 -mr-1 text-muted-foreground/40 hover:text-foreground transition-colors rounded"
            title="Drag to move deal stage"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Deal Title */}
      <Link
        href={`/deals/detail/${deal.id}`}
        className="block group/link"
        onClick={(e) => {
          // If dragged, avoid accidental link trigger
          if (isDragging) e.preventDefault();
        }}
      >
        <h4 className="text-xs font-semibold text-foreground leading-snug group-hover/link:text-primary transition-colors line-clamp-2 mb-2.5">
          {deal.title}
        </h4>
      </Link>

      {/* Deal Value */}
      <div className="flex items-baseline gap-1 mb-3">
        <DollarSign className="h-3.5 w-3.5 text-primary self-center shrink-0" />
        <span className="text-sm font-bold text-foreground tracking-tight">
          {formatCurrency(deal.deal_value_usd)}
        </span>
        {deal.subscription_tier && (
          <span className="ml-auto text-[9px] uppercase tracking-wider font-semibold text-muted-foreground/80 bg-muted/60 px-1.5 py-0.5 rounded">
            {deal.subscription_tier}
          </span>
        )}
      </div>

      {/* Bottom Footer: Owner & Expected Close Date */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
        {/* Owner avatar & name */}
        <div
          className="flex items-center gap-1.5 min-w-0"
          title={`Assigned to: ${deal.owner_name}`}
        >
          <div className="h-5 w-5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[9px] font-bold shrink-0">
            {initials}
          </div>
          <span className="truncate max-w-[90px] text-foreground/80">
            {deal.owner_name}
          </span>
        </div>

        {/* Expected Close Date */}
        {deal.expected_close_date && (
          <div
            className="flex items-center gap-1 shrink-0 text-muted-foreground text-[10px]"
            title={`Expected Close: ${deal.expected_close_date}`}
          >
            <Calendar className="h-3 w-3" />
            <span>{formatDate(deal.expected_close_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
