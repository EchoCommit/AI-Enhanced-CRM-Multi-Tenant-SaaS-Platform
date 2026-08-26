export interface TenantTheme {
  primaryColor: string;    // e.g. "#4f46e5" or "221.2 83.2% 53.3%"
  accentColor: string;     // e.g. "#7c3aed" or "262.1 83.3% 57.8%"
  logoUrl: string;         // e.g. "/nexus-logo.svg"
  fontFamily: string;      // e.g. "Inter, sans-serif"
  colorPrimary?: string;   // Backward compatible alias
  colorAccent?: string;    // Backward compatible alias
  colorBackground?: string;// Backward compatible alias
}

export interface TenantConfig {
  tenantId: string;
  name: string;
  theme: TenantTheme;
}

