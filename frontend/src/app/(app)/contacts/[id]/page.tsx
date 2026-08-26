/**
 * Contact Detail Page — Placeholder
 *
 * This is a route target for row-click navigation from the contacts table.
 * Replace the body with the real contact detail implementation when ready.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Detail · Nexus CRM",
};

interface ContactDetailPageProps {
  params: { id: string };
}

export default function ContactDetailPage({ params }: ContactDetailPageProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/contacts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Contacts
      </Link>

      {/* Placeholder card */}
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 flex flex-col items-center justify-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground">
          <User className="h-7 w-7" />
        </span>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">
            Contact Detail
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            This is a placeholder for contact{" "}
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              {params.id}
            </code>
            . The full detail view — activities timeline, AI score breakdown,
            linked deal cards — will be built here.
          </p>
        </div>
      </div>
    </div>
  );
}
