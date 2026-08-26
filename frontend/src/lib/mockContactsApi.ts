/**
 * Mock Contacts API
 *
 * ─── SWAP POINT ─────────────────────────────────────────────────────────────
 * To wire up the real REST/GraphQL endpoint replace ONLY the body of:
 *   fetchContactsPage()  →  the GET /api/v1/contacts paginated list
 *   createContact()      →  the POST /api/v1/contacts create mutation
 * ────────────────────────────────────────────────────────────────────────────
 */
import type {
  Contact,
  ContactsPage,
  ContactsQueryParams,
  NewContactFormValues,
} from "@/types/contacts";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Seed data (50 contacts) ──────────────────────────────────────────────────

const OWNERS = [
  { id: "user-001", name: "Sarah Chen" },
  { id: "user-002", name: "Marcus Webb" },
  { id: "user-003", name: "Jordan Kim" },
  { id: "user-004", name: "Priya Nair" },
];

const ACCOUNTS = [
  { id: "acc-001", name: "Acme Corp" },
  { id: "acc-002", name: "TechVault Ltd" },
  { id: "acc-003", name: "BlueStar Retail" },
  { id: "acc-004", name: "Pinnacle Health" },
  { id: "acc-005", name: "Meridian Logistics" },
  { id: "acc-006", name: "Nova Analytics" },
  { id: "acc-007", name: "Summit Education" },
  { id: "acc-008", name: "Orion Dynamics" },
  { id: "acc-009", name: "Bright Future Inc" },
  { id: "acc-010", name: "Greenfield Motors" },
];

const TITLES = [
  "VP of Sales",
  "Head of Engineering",
  "Chief Financial Officer",
  "Procurement Manager",
  "CTO",
  "Director of Operations",
  "IT Manager",
  "CEO",
  "Product Manager",
  "Marketing Director",
];

function makeContact(i: number): Contact {
  const owner = OWNERS[i % OWNERS.length];
  const account = ACCOUNTS[i % ACCOUNTS.length];
  const score = i % 5 === 0 ? null : parseFloat((Math.random() * 0.95 + 0.04).toFixed(4));
  const daysAgo = Math.floor(Math.random() * 30);
  const lastActivity = new Date(Date.now() - daysAgo * 86_400_000).toISOString();
  const firstNames = [
    "Alice","Ben","Carla","David","Elena","Frank","Grace","Hugo","Iris","Jack",
    "Karen","Liam","Maya","Nolan","Olivia","Paul","Quinn","Rose","Sam","Tara",
    "Uma","Victor","Wendy","Xander","Yara","Zoe","Aiden","Beth","Chris","Diana",
    "Ethan","Fiona","George","Hana","Ivan","Julia","Kevin","Laura","Mike","Nina",
    "Omar","Petra","Rafael","Stella","Tom","Ursula","Vince","Willa","Xu","Yvonne",
  ];
  const lastNames = [
    "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson",
    "Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson",
    "Martinez","Robinson","Clark","Rodriguez","Lewis","Lee","Walker","Hall","Allen",
    "Young","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams",
    "Nelson","Baker","Carter","Mitchell","Perez","Roberts","Turner","Phillips","Campbell",
    "Parker","Evans","Edwards","Collins",
  ];

  const first = firstNames[i % firstNames.length];
  const last = lastNames[i % lastNames.length];

  return {
    id: `contact-${String(i + 1).padStart(3, "0")}`,
    account_id: account.id,
    account_name: account.name,
    name: `${first} ${last}`,
    first_name: first,
    last_name: last,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${account.name.toLowerCase().replace(/\s+/g, "")}.com`,
    phone: `+1 (${300 + i}) ${400 + i}-${String(5000 + i).slice(-4)}`,
    title: TITLES[i % TITLES.length],
    is_decision_maker: i % 4 === 0,
    lead_score: score,
    owner_name: owner.name,
    owner_id: owner.id,
    last_activity_at: daysAgo < 28 ? lastActivity : null,
    created_at: new Date(Date.now() - (60 - i) * 2 * 86_400_000).toISOString(),
  };
}

const ALL_CONTACTS: Contact[] = Array.from({ length: 50 }, (_, i) => makeContact(i));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applySort(
  contacts: Contact[],
  sort_by: ContactsQueryParams["sort_by"] = "created_at",
  order: ContactsQueryParams["order"] = "desc"
): Contact[] {
  return [...contacts].sort((a, b) => {
    let aVal: string | number | null;
    let bVal: string | number | null;

    switch (sort_by) {
      case "name":         aVal = a.name;            bVal = b.name;            break;
      case "email":        aVal = a.email ?? "";      bVal = b.email ?? "";     break;
      case "account_name": aVal = a.account_name;    bVal = b.account_name;    break;
      case "lead_score":   aVal = a.lead_score ?? -1; bVal = b.lead_score ?? -1; break;
      case "last_activity_at":
        aVal = a.last_activity_at ? new Date(a.last_activity_at).getTime() : 0;
        bVal = b.last_activity_at ? new Date(b.last_activity_at).getTime() : 0;
        break;
      default:
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
    }

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// ─── Exported fetchers ────────────────────────────────────────────────────────

/**
 * Fetch a page of contacts.
 *
 * ✅ CURRENT: deterministic mock with simulated cursor pagination.
 * 🔄 TO SWAP: replace body with real API call:
 *   const res = await apiClient.get(`/contacts`, { params });
 *   return res.data;
 */
export async function fetchContactsPage(
  params: ContactsQueryParams = {}
): Promise<ContactsPage> {
  await delay(500);

  const {
    cursor,
    per_page = 20,
    sort_by = "created_at",
    order = "desc",
    search = "",
  } = params;

  // Filter
  const filtered = search.trim()
    ? ALL_CONTACTS.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
          c.account_name.toLowerCase().includes(search.toLowerCase())
      )
    : ALL_CONTACTS;

  // Sort
  const sorted = applySort(filtered, sort_by, order);

  // Cursor → index
  const startIdx = cursor
    ? sorted.findIndex((c) => c.id === cursor) + 1
    : 0;

  const page = sorted.slice(startIdx, startIdx + per_page);
  const lastItem = page[page.length - 1];
  const nextIndex = startIdx + per_page;

  return {
    data: page,
    meta: {
      next_cursor: nextIndex < sorted.length ? lastItem?.id ?? null : null,
      prev_cursor: startIdx > 0 ? sorted[startIdx - 1]?.id ?? null : null,
      total: sorted.length,
      per_page,
    },
  };
}

/**
 * Create a new contact.
 *
 * ✅ CURRENT: pushes to the in-memory array (resets on page reload).
 * 🔄 TO SWAP: replace body with:
 *   const res = await apiClient.post(`/contacts`, values);
 *   return res.data.data;
 */
export async function createContact(
  values: NewContactFormValues
): Promise<Contact> {
  await delay(700);

  const account = ACCOUNTS.find((a) => a.id === values.account_id) ?? {
    id: values.account_id,
    name: "Unknown Account",
  };

  const newContact: Contact = {
    id: `contact-${String(ALL_CONTACTS.length + 1).padStart(3, "0")}`,
    account_id: account.id,
    account_name: account.name,
    name: `${values.first_name} ${values.last_name}`,
    first_name: values.first_name,
    last_name: values.last_name,
    email: values.email || null,
    phone: values.phone || null,
    title: values.title || null,
    is_decision_maker: false,
    lead_score: null,
    owner_name: null,
    owner_id: null,
    last_activity_at: null,
    created_at: new Date().toISOString(),
  };

  ALL_CONTACTS.unshift(newContact);
  return newContact;
}

/** Expose accounts for the "New Contact" form select */
export function getAccounts() {
  return ACCOUNTS;
}
