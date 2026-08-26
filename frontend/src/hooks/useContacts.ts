"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ContactsQueryParams, NewContactFormValues } from "@/types/contacts";
// ⬇️  ONE LINE CHANGE: replace these imports with your real API client
import { fetchContactsPage, createContact } from "@/lib/mockContactsApi";

export const CONTACTS_QUERY_KEY = "contacts" as const;

/** Cursor-paginated contacts list hook */
export function useContacts(params: ContactsQueryParams = {}) {
  return useQuery({
    queryKey: [CONTACTS_QUERY_KEY, params],
    queryFn: () => fetchContactsPage(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev, // keep prev page visible while fetching next
  });
}

/** Create-contact mutation — invalidates the contacts list on success */
export function useCreateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: NewContactFormValues) => createContact(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}
