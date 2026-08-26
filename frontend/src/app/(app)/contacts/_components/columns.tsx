"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Star } from "lucide-react";
import type { Contact, ContactSortField, SortOrder } from "@/types/contacts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null)
    return <span className="text-xs text-muted-foreground/50">—</span>;

  const pct = Math.round(score * 100);
  const color =
    pct >= 80
      ? "bg-emerald-500/15 text-emerald-400"
      : pct >= 50
      ? "bg-amber-500/15 text-amber-400"
      : "bg-red-500/15 text-red-400";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${color}`}
    >
      <Star className="h-2.5 w-2.5" />
      {pct}%
    </span>
  );
}

function RelativeDate({ iso }: { iso: string | null }) {
  if (!iso) return <span className="text-xs text-muted-foreground/50">Never</span>;
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return <span className="text-xs text-foreground">Today</span>;
  if (days === 1) return <span className="text-xs text-foreground">Yesterday</span>;
  return <span className="text-xs text-muted-foreground">{days}d ago</span>;
}

interface SortHeaderProps {
  label: string;
  field: ContactSortField;
  currentSort: ContactSortField;
  currentOrder: SortOrder;
  onSort: (field: ContactSortField) => void;
}

export function SortHeader({
  label,
  field,
  currentSort,
  currentOrder,
  onSort,
}: SortHeaderProps) {
  const active = currentSort === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors select-none"
    >
      {label}
      {active ? (
        currentOrder === "asc" ? (
          <ArrowUp className="h-3 w-3 text-primary" />
        ) : (
          <ArrowDown className="h-3 w-3 text-primary" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────
// Using ColumnDef<Contact, any> avoids the TanStack Table v8 generic covariance
// issue where mixed accessor value types (string | null, number | null, etc.)
// are not assignable to ColumnDef<Contact, unknown>.

export function buildContactColumns(
  currentSort: ContactSortField,
  currentOrder: SortOrder,
  onSort: (field: ContactSortField) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ColumnDef<Contact, any>[] {
  return [
    // ── Avatar ────────────────────────────────────────────────────────────────
    {
      id: "avatar",
      size: 48,
      cell: ({ row }) => {
        const initials = `${row.original.first_name[0] ?? ""}${row.original.last_name[0] ?? ""}`;
        const colors = [
          "bg-indigo-500/20 text-indigo-400",
          "bg-violet-500/20 text-violet-400",
          "bg-teal-500/20 text-teal-400",
          "bg-rose-500/20 text-rose-400",
          "bg-amber-500/20 text-amber-400",
        ];
        const color = colors[row.index % colors.length];
        return (
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${color}`}
          >
            {initials}
          </div>
        );
      },
    },

    // ── Name + title ──────────────────────────────────────────────────────────
    {
      accessorKey: "name",
      id: "name",
      size: 200,
      header: () => (
        <SortHeader
          label="Name"
          field="name"
          currentSort={currentSort}
          currentOrder={currentOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }: { row: { original: Contact } }) => (
        <div>
          <p className="text-sm font-medium text-foreground leading-tight">
            {row.original.name}
            {row.original.is_decision_maker && (
              <span className="ml-1.5 inline-block rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-primary/10 text-primary">
                DM
              </span>
            )}
          </p>
          <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
            {row.original.title ?? "—"}
          </p>
        </div>
      ),
    },

    // ── Email ─────────────────────────────────────────────────────────────────
    {
      accessorKey: "email",
      id: "email",
      size: 220,
      header: () => (
        <SortHeader
          label="Email"
          field="email"
          currentSort={currentSort}
          currentOrder={currentOrder}
          onSort={onSort}
        />
      ),
      cell: ({ getValue }: { getValue: () => string | null }) => (
        <span className="text-xs text-muted-foreground font-mono truncate block max-w-[200px]">
          {getValue() ?? "—"}
        </span>
      ),
    },

    // ── Company ───────────────────────────────────────────────────────────────
    {
      accessorKey: "account_name",
      id: "account_name",
      size: 180,
      header: () => (
        <SortHeader
          label="Company"
          field="account_name"
          currentSort={currentSort}
          currentOrder={currentOrder}
          onSort={onSort}
        />
      ),
      cell: ({ getValue }: { getValue: () => string }) => (
        <span className="text-xs font-medium text-foreground/80">
          {getValue()}
        </span>
      ),
    },

    // ── AI Score ─────────────────────────────────────────────────────────────
    {
      accessorKey: "lead_score",
      id: "lead_score",
      size: 110,
      header: () => (
        <SortHeader
          label="AI Score"
          field="lead_score"
          currentSort={currentSort}
          currentOrder={currentOrder}
          onSort={onSort}
        />
      ),
      cell: ({ getValue }: { getValue: () => number | null }) => (
        <ScoreBadge score={getValue()} />
      ),
    },

    // ── Owner ─────────────────────────────────────────────────────────────────
    {
      accessorKey: "owner_name",
      id: "owner_name",
      size: 140,
      header: () => (
        <span className="text-xs font-medium text-muted-foreground">Owner</span>
      ),
      cell: ({ getValue }: { getValue: () => string | null }) => (
        <span className="text-xs text-muted-foreground">{getValue() ?? "—"}</span>
      ),
    },

    // ── Last activity ─────────────────────────────────────────────────────────
    {
      accessorKey: "last_activity_at",
      id: "last_activity_at",
      size: 120,
      header: () => (
        <SortHeader
          label="Last Activity"
          field="last_activity_at"
          currentSort={currentSort}
          currentOrder={currentOrder}
          onSort={onSort}
        />
      ),
      cell: ({ getValue }: { getValue: () => string | null }) => (
        <RelativeDate iso={getValue()} />
      ),
    },
  ];
}
