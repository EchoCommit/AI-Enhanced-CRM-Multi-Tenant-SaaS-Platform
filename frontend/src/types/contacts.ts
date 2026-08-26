/**
 * Contact domain types
 * Mirrors the `contacts` table in the SDD database-map.md exactly.
 */

/** Row shape matching the `contacts` table + joined fields */
export interface Contact {
  id: string;
  account_id: string;
  /** Joined: name of the parent account */
  account_name: string;
  name: string; // full name — first_name + last_name concatenated
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  is_decision_maker: boolean;
  /** Joined from the linked lead row — null if no lead exists */
  lead_score: number | null; // maps to leads.lead_hot
  /** Joined: display name of the assigned rep */
  owner_name: string | null;
  owner_id: string | null;
  /** ISO string of the most recent activity.occurred_at for this contact */
  last_activity_at: string | null;
  created_at: string;
}

// ─── Form schema (new contact) ────────────────────────────────────────────────
// Matches the SDD contacts table columns.

export interface NewContactFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  account_id: string;
}

// ─── Cursor-based pagination envelope ────────────────────────────────────────
// Follows the API-map.md cursor pattern swapped in when real endpoint lands.

export interface CursorMeta {
  /** Opaque cursor pointing to the last item of the current page */
  next_cursor: string | null;
  /** Opaque cursor pointing to the first item of the current page */
  prev_cursor: string | null;
  /** Total record count (may be approximate on real cursor pagination) */
  total: number;
  per_page: number;
}

export interface ContactsPage {
  data: Contact[];
  meta: CursorMeta;
}

// ─── List query params ────────────────────────────────────────────────────────

export type ContactSortField =
  | "name"
  | "email"
  | "account_name"
  | "lead_score"
  | "last_activity_at"
  | "created_at";

export type SortOrder = "asc" | "desc";

export interface ContactsQueryParams {
  cursor?: string | null;
  per_page?: number;
  sort_by?: ContactSortField;
  order?: SortOrder;
  /** Free-text search across name / email / account */
  search?: string;
}
