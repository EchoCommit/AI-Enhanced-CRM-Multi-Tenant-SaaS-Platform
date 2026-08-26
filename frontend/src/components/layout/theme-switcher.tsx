"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores";
import { MOCK_TENANTS } from "@/lib/mockTenants";
import { Palette, Check, RefreshCw, ChevronDown, Sliders } from "lucide-react";

export function ThemeSwitcher() {
  const { tenantConfig, switchTenant, updateTheme, isLoading } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const activeTheme = tenantConfig.theme;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium hover:bg-accent transition-colors shadow-sm"
        title="Switch Tenant Theme (Dev Testing)"
      >
        <Palette className="h-3.5 w-3.5 text-tenant-primary" />
        <span className="font-semibold">{tenantConfig.name}</span>
        <div className="flex items-center gap-1">
          <span
            className="h-2.5 w-2.5 rounded-full border border-black/10 inline-block"
            style={{ backgroundColor: activeTheme.primaryColor }}
            title={`Primary: ${activeTheme.primaryColor}`}
          />
          <span
            className="h-2.5 w-2.5 rounded-full border border-black/10 inline-block"
            style={{ backgroundColor: activeTheme.accentColor }}
            title={`Accent: ${activeTheme.accentColor}`}
          />
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setShowCustomizer(false);
            }}
          />

          <div className="absolute right-0 mt-2 w-72 z-50 rounded-lg border border-border bg-card p-3 shadow-xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-tenant-primary" /> Tenant Theme Switcher
              </span>
              <button
                onClick={() => setShowCustomizer(!showCustomizer)}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[11px]"
              >
                <Sliders className="h-3 w-3" />
                {showCustomizer ? "Presets" : "Custom"}
              </button>
            </div>

            {!showCustomizer ? (
              <div className="space-y-1">
                <div className="text-[11px] text-muted-foreground px-1 pb-1">
                  Select a tenant theme config:
                </div>
                {MOCK_TENANTS.map((t) => {
                  const isSelected = t.tenantId === tenantConfig.tenantId;
                  return (
                    <button
                      key={t.tenantId}
                      disabled={isLoading}
                      onClick={() => {
                        switchTenant(t.tenantId);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
                        isSelected
                          ? "bg-accent/80 font-medium text-foreground border border-tenant-primary/30"
                          : "hover:bg-accent/40 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          <span
                            className="h-3 w-3 rounded-full border border-black/10"
                            style={{ backgroundColor: t.theme.primaryColor }}
                          />
                          <span
                            className="h-3 w-3 rounded-full border border-black/10"
                            style={{ backgroundColor: t.theme.accentColor }}
                          />
                        </div>
                        <span>{t.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-tenant-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="text-[11px] text-muted-foreground">
                  Live Custom CSS Properties:
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground block">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeTheme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="h-6 w-8 rounded cursor-pointer border border-border bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={activeTheme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="flex-1 px-2 py-1 rounded border border-border bg-background text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground block">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeTheme.accentColor}
                      onChange={(e) => updateTheme({ accentColor: e.target.value })}
                      className="h-6 w-8 rounded cursor-pointer border border-border bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={activeTheme.accentColor}
                      onChange={(e) => updateTheme({ accentColor: e.target.value })}
                      className="flex-1 px-2 py-1 rounded border border-border bg-background text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground block">
                    Font Family
                  </label>
                  <select
                    value={activeTheme.fontFamily}
                    onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                    className="w-full px-2 py-1 rounded border border-border bg-background text-xs"
                  >
                    <option value="Inter, sans-serif">Inter (Default)</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Outfit, sans-serif">Outfit</option>
                    <option value="system-ui, sans-serif">System UI</option>
                    <option value="'Courier New', monospace">Courier Monospace</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground block">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={activeTheme.logoUrl}
                    onChange={(e) => updateTheme({ logoUrl: e.target.value })}
                    className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Saved in localStorage</span>
              {isLoading && (
                <span className="flex items-center gap-1 text-tenant-primary">
                  <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Updating...
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
