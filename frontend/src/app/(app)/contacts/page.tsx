/**
 * Contacts Page — Server Component Shell
 *
 * Static chrome (heading + metadata) rendered on the server.
 * <ContactsTableClient /> is the only interactive island — it owns the
 * TanStack Query hook, sort/filter state, virtualiser, and the New Contact modal.
 */

import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ContactsTableClient } from "./_components/ContactsTableClient";

export const metadata: Metadata = {
  title: "Contacts · Nexus CRM",
  description:
    "Browse, search, and manage all contacts in your Nexus CRM workspace.",
};

export default function ContactsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Page header — server-rendered, zero client JS */}
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Contacts
          </h1>
          <p className="text-sm text-muted-foreground">
            All contacts across your pipeline — sortable, filterable, virtualised
          </p>
        </div>
      </div>

      {/* Client island — table, search, pagination, modal */}
      <ContactsTableClient />
    </div>
  );
}
