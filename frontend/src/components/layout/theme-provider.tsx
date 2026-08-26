"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Placeholder ThemeProvider component.
 * Later, this will fetch per-tenant theme configuration from API / server context
 * and inject dynamic CSS custom properties into :root.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const applyThemeToDom = useThemeStore((state) => state.applyThemeToDom);

  useEffect(() => {
    applyThemeToDom();
  }, [applyThemeToDom]);

  return <>{children}</>;
}
