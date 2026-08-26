"use client";

import { useThemeStore } from "@/stores";
import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  const { tenantConfig } = useThemeStore();

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between font-tenant">
      <div className="text-sm font-medium text-muted-foreground">
        Workspace:{" "}
        <span className="text-foreground font-semibold">
          {tenantConfig.name}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {/* Dev testing Theme Switcher */}
        <ThemeSwitcher />

        <div className="h-8 w-8 rounded-full bg-tenant-accent/10 border border-tenant-accent/30 text-tenant-accent flex items-center justify-center font-bold text-xs">
          US
        </div>
      </div>
    </header>
  );
}
