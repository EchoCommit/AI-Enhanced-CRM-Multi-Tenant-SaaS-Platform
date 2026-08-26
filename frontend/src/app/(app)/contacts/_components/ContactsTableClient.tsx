"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRouter } from "next/navigation";
import {
  Search,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContacts } from "@/hooks/useContacts";
import { buildContactColumns } from "./columns";
import { NewContactModal } from "./NewContactModal";
import type { ContactSortField, SortOrder, ContactsQueryParams } from "@/types/contacts";

// ─── Row skeleton ─────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-px">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 border-b border-border/40"
        >
          <div className="h-8 w-8 rounded-full bg-muted/40 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 rounded bg-muted/40" />
            <div className="h-2.5 w-24 rounded bg-muted/30" />
          </div>
          <div className="h-3 w-40 rounded bg-muted/30 hidden sm:block" />
          <div className="h-3 w-24 rounded bg-muted/30 hidden md:block" />
          <div className="h-5 w-12 rounded-full bg-muted/40 hidden lg:block" />
          <div className="h-3 w-20 rounded bg-muted/30 hidden xl:block" />
          <div className="h-3 w-16 rounded bg-muted/30 hidden xl:block" />
        </div>
      ))}
    </div>
  );
}

// ─── Main table island ────────────────────────────────────────────────────────

export function ContactsTableClient() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Query params state ──────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<ContactSortField>("created_at");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [cursorStack, setCursorStack] = useState<Array<string | null>>([null]); // stack[0] = first page
  const pageIndex = cursorStack.length - 1; // 0-based
  const currentCursor = cursorStack[pageIndex];

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setCursorStack([null]); // reset to page 1 on new search
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const params: ContactsQueryParams = useMemo(
    () => ({
      cursor: currentCursor,
      per_page: 20,
      sort_by: sortBy,
      order,
      search: debouncedSearch,
    }),
    [currentCursor, sortBy, order, debouncedSearch]
  );

  const { data, isLoading, isFetching } = useContacts(params);

  // ── Sort handler ────────────────────────────────────────────────────────────
  const handleSort = useCallback(
    (field: ContactSortField) => {
      setCursorStack([null]);
      if (field === sortBy) {
        setOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setOrder("desc");
      }
    },
    [sortBy]
  );

  // ── Pagination ──────────────────────────────────────────────────────────────
  const handleNextPage = useCallback(() => {
    if (data?.meta.next_cursor) {
      setCursorStack((s) => [...s, data.meta.next_cursor]);
    }
  }, [data?.meta.next_cursor]);

  const handlePrevPage = useCallback(() => {
    setCursorStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  // ── Table instance ──────────────────────────────────────────────────────────
  const columns = useMemo(
    () => buildContactColumns(sortBy, order, handleSort),
    [sortBy, order, handleSort]
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  const rows = table.getRowModel().rows;

  // ── Virtualiser ─────────────────────────────────────────────────────────────
  const tableBodyRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableBodyRef.current,
    estimateSize: () => 60,
    overscan: 8,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();

  // ── Totals copy ─────────────────────────────────────────────────────────────
  const total = data?.meta.total ?? 0;
  const perPage = data?.meta.per_page ?? 20;
  const pageStart = pageIndex * perPage + 1;
  const pageEnd = Math.min(pageStart + (data?.data.length ?? 0) - 1, total);

  return (
    <div className="flex flex-col h-full gap-0">
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-1 pb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            id="contacts-search"
            placeholder="Search name, email, company…"
            className="pl-8 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isFetching && !isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}

        <Button
          id="contacts-new-btn"
          size="sm"
          className="ml-auto flex items-center gap-1.5"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus className="h-3.5 w-3.5" />
          New Contact
        </Button>
      </div>

      {/* ── Table card ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border/60 bg-muted/20">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2.5 text-left align-middle"
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          </table>
        </div>

        {/* Body — virtualised */}
        {isLoading ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-2">
            <Users className="h-8 w-8 opacity-30" />
            <p className="text-sm">No contacts found.</p>
            {debouncedSearch && (
              <p className="text-xs opacity-70">
                Try a different search term.
              </p>
            )}
          </div>
        ) : (
          <div
            ref={tableBodyRef}
            className="overflow-y-auto"
            style={{ height: Math.min(totalHeight + 2, 520) }}
          >
            <div
              className="relative overflow-x-auto"
              style={{ height: totalHeight }}
            >
              <table className="w-full min-w-[720px] table-fixed absolute inset-x-0 top-0">
                <tbody>
                  {virtualRows.map((vRow) => {
                    const row = rows[vRow.index];
                    return (
                      <tr
                        key={row.id}
                        data-index={vRow.index}
                        ref={rowVirtualizer.measureElement}
                        onClick={() =>
                          router.push(`/contacts/${row.original.id}`)
                        }
                        className="border-b border-border/40 hover:bg-muted/30 cursor-pointer transition-colors group"
                        style={{
                          transform: `translateY(${vRow.start}px)`,
                          position: "absolute",
                          width: "100%",
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-2.5 align-middle"
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-muted/10">
          <p className="text-[11px] text-muted-foreground">
            {total > 0
              ? `Showing ${pageStart}–${pageEnd} of ${total} contacts`
              : "No contacts"}
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              id="contacts-prev-page"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={pageIndex === 0 || isLoading}
              onClick={handlePrevPage}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            <span className="text-[11px] text-muted-foreground px-1">
              Page {pageIndex + 1}
            </span>

            <Button
              id="contacts-next-page"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={!data?.meta.next_cursor || isLoading}
              onClick={handleNextPage}
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* New Contact modal */}
      <NewContactModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
