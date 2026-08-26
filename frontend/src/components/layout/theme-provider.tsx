"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider client component that fetches tenant theme config (mock static JSON object),
 * injects it as CSS custom properties into :root, and caches it in localStorage.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return <>{children}</>;
}
