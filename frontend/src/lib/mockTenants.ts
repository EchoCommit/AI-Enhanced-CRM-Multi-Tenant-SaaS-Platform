import { TenantConfig } from "@/types";

export const MOCK_TENANTS: TenantConfig[] = [
  {
    tenantId: "tenant-nexus",
    name: "Nexus Default",
    theme: {
      primaryColor: "#4f46e5",
      accentColor: "#7c3aed",
      logoUrl: "/nexus-logo.svg",
      fontFamily: "Inter, sans-serif",
      colorPrimary: "239 84% 67%",
      colorAccent: "263 70% 50%",
      colorBackground: "210 40% 98%",
    },
  },
  {
    tenantId: "tenant-acme",
    name: "Acme Corp",
    theme: {
      primaryColor: "#2563eb",
      accentColor: "#f59e0b",
      logoUrl: "/acme-logo.svg",
      fontFamily: "Roboto, sans-serif",
      colorPrimary: "217 91% 60%",
      colorAccent: "38 92% 50%",
      colorBackground: "210 40% 98%",
    },
  },
  {
    tenantId: "tenant-cyberdyne",
    name: "Cyberdyne Systems",
    theme: {
      primaryColor: "#059669",
      accentColor: "#0d9488",
      logoUrl: "/cyberdyne-logo.svg",
      fontFamily: "Outfit, sans-serif",
      colorPrimary: "160 84% 39%",
      colorAccent: "173 80% 40%",
      colorBackground: "210 40% 98%",
    },
  },
  {
    tenantId: "tenant-stark",
    name: "Stark Industries",
    theme: {
      primaryColor: "#dc2626",
      accentColor: "#f43f5e",
      logoUrl: "/stark-logo.svg",
      fontFamily: "system-ui, sans-serif",
      colorPrimary: "0 72% 51%",
      colorAccent: "347 89% 60%",
      colorBackground: "210 40% 98%",
    },
  },
];

export const DEFAULT_TENANT_CONFIG: TenantConfig = MOCK_TENANTS[0];

/**
 * Mock API call to simulate fetching tenant theme config from backend/CDN
 */
export async function fetchTenantThemeConfig(tenantId?: string): Promise<TenantConfig> {
  // Simulate network latency (e.g. 50ms)
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  if (!tenantId) return DEFAULT_TENANT_CONFIG;
  const match = MOCK_TENANTS.find((t) => t.tenantId === tenantId);
  return match || DEFAULT_TENANT_CONFIG;
}
