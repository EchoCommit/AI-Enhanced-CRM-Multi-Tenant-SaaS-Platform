import { create } from "zustand";
import { TenantConfig, TenantTheme } from "@/types";
import { DEFAULT_TENANT_CONFIG, fetchTenantThemeConfig } from "@/lib/mockTenants";

const STORAGE_KEY = "nexus_tenant_theme_config";

interface ThemeState {
  tenantConfig: TenantConfig;
  isLoading: boolean;
  isInitialized: boolean;
  initTheme: () => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  updateTheme: (partialTheme: Partial<TenantTheme>) => void;
  applyThemeToDom: (config?: TenantConfig) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  tenantConfig: DEFAULT_TENANT_CONFIG,
  isLoading: false,
  isInitialized: false,

  initTheme: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });

    let configToApply = DEFAULT_TENANT_CONFIG;

    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as TenantConfig;
          if (parsed && parsed.theme && parsed.theme.primaryColor) {
            configToApply = parsed;
          }
        } else {
          // Fetch default static JSON configuration on initial load
          const fetched = await fetchTenantThemeConfig();
          configToApply = fetched;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fetched));
        }
      } catch (e) {
        console.warn("Failed to load tenant theme from storage/API, falling back to default.", e);
      }
    }

    set({
      tenantConfig: configToApply,
      isLoading: false,
      isInitialized: true,
    });

    get().applyThemeToDom(configToApply);
  },

  switchTenant: async (tenantId: string) => {
    set({ isLoading: true });
    try {
      const config = await fetchTenantThemeConfig(tenantId);
      set({ tenantConfig: config, isLoading: false });

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      }

      get().applyThemeToDom(config);
    } catch (e) {
      console.error("Failed to switch tenant theme", e);
      set({ isLoading: false });
    }
  },

  updateTheme: (partialTheme: Partial<TenantTheme>) => {
    const current = get().tenantConfig;
    const updatedConfig: TenantConfig = {
      ...current,
      theme: {
        ...current.theme,
        ...partialTheme,
      },
    };

    set({ tenantConfig: updatedConfig });

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
    }

    get().applyThemeToDom(updatedConfig);
  },

  applyThemeToDom: (config?: TenantConfig) => {
    if (typeof window === "undefined") return;

    const targetConfig = config || get().tenantConfig;
    const { theme } = targetConfig;
    const root = document.documentElement;

    const { primaryColor, accentColor, logoUrl, fontFamily } = theme;

    // Inject CSS custom properties into :root
    root.style.setProperty("--color-primary", primaryColor);
    root.style.setProperty("--color-accent", accentColor);

    const formattedLogoUrl = logoUrl.startsWith("url(") ? logoUrl : `url('${logoUrl}')`;
    root.style.setProperty("--logo-url", formattedLogoUrl);
    root.style.setProperty("--font-family", fontFamily);
    root.style.setProperty("--font-tenant", fontFamily);

    // Apply font to document body
    if (document.body) {
      document.body.style.fontFamily = fontFamily;
    }
  },
}));
