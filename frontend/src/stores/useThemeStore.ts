import { create } from "zustand";
import { TenantTheme } from "@/types";

interface ThemeState {
  theme: TenantTheme;
  setTenantTheme: (theme: Partial<TenantTheme>) => void;
  applyThemeToDom: () => void;
}

const defaultTheme: TenantTheme = {
  colorPrimary: "221.2 83.2% 53.3%",
  colorAccent: "262.1 83.3% 57.8%",
  colorBackground: "210 40% 98%",
  logoUrl: "url('/nexus-logo.svg')",
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: defaultTheme,
  setTenantTheme: (newTheme) => {
    set((state) => ({
      theme: { ...state.theme, ...newTheme },
    }));
    get().applyThemeToDom();
  },
  applyThemeToDom: () => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const { colorPrimary, colorAccent, colorBackground, logoUrl } = get().theme;
    
    root.style.setProperty("--color-primary", colorPrimary);
    root.style.setProperty("--color-accent", colorAccent);
    root.style.setProperty("--color-background", colorBackground);
    root.style.setProperty("--logo-url", logoUrl);
  },
}));
