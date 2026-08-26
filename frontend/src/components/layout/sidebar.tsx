"use client";

import Link from "next/link";
import { LayoutDashboard, Users, GitBranch, Mail, Bot, Settings } from "lucide-react";
import { useThemeStore } from "@/stores";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/deals/sales-pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/sequences", label: "Sequences", icon: Mail },
  { href: "/ai", label: "AI Insights", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { tenantConfig } = useThemeStore();

  return (
    <aside className="w-64 border-r border-border bg-card p-4 flex flex-col justify-between h-screen font-tenant">
      <div>
        <div className="flex items-center gap-2 px-2 py-4 mb-4">
          <div className="h-8 w-8 rounded-lg bg-tenant-primary text-white flex items-center justify-center font-bold shadow-sm">
            {tenantConfig.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base leading-tight">Nexus CRM</span>
            <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">
              {tenantConfig.name}
            </span>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-tenant-primary/10 hover:text-tenant-primary transition-colors"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-border pt-4 text-xs text-muted-foreground flex items-center justify-between">
        <span>Multi-Tenant SaaS</span>
        <span
          className="h-2 w-2 rounded-full inline-block"
          style={{ backgroundColor: tenantConfig.theme.accentColor }}
          title={`Active Accent: ${tenantConfig.theme.accentColor}`}
        />
      </div>
    </aside>
  );
}
