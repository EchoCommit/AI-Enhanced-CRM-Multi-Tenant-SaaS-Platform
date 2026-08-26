export interface TenantTheme {
  colorPrimary: string; // e.g. "221.2 83.2% 53.3%"
  colorAccent: string;  // e.g. "262.1 83.3% 57.8%"
  colorBackground: string; // e.g. "210 40% 98%"
  logoUrl: string;       // e.g. "/nexus-logo.svg"
}

export interface TenantConfig {
  tenantId: string;
  name: string;
  theme: TenantTheme;
}
