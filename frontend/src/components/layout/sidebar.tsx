"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/stores";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Mail,
  Bot,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/deals/sales-pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/sequences", label: "Sequences", icon: Mail },
  { href: "/ai", label: "AI Insights", icon: Bot, badge: "AI" },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { tenantConfig } = useThemeStore();
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={`h-screen border-r border-border bg-card flex flex-col justify-between transition-all duration-300 font-tenant z-20 ${
          isManuallyCollapsed
            ? "w-16 sm:w-20"
            : "w-16 sm:w-20 lg:w-64"
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="h-16 px-3 lg:px-4 border-b border-border flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 overflow-hidden text-left group"
            >
              <div className="h-9 w-9 rounded-lg bg-tenant-primary text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {tenantConfig.name.charAt(0)}
              </div>
              <div
                className={`flex flex-col transition-opacity duration-200 ${
                  isManuallyCollapsed ? "hidden" : "hidden lg:flex"
                }`}
              >
                <span className="font-bold text-sm leading-tight text-foreground truncate">
                  Nexus CRM
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                  {tenantConfig.name}
                </span>
              </div>
            </Link>

            {/* Desktop Manual Collapse Button */}
            <button
              onClick={() => setIsManuallyCollapsed(!isManuallyCollapsed)}
              className={`hidden lg:flex p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ${
                isManuallyCollapsed ? "mx-auto mt-1" : ""
              }`}
              title={isManuallyCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isManuallyCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              const linkContent = (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-tenant-primary text-white font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-tenant-primary/10 hover:text-tenant-primary"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  <span
                    className={`truncate transition-opacity duration-200 ${
                      isManuallyCollapsed ? "hidden" : "hidden lg:inline"
                    }`}
                  >
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      className={`ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-tenant-primary/15 text-tenant-primary"
                      } ${isManuallyCollapsed ? "hidden" : "hidden lg:inline-flex"}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );

              return (
                <div key={item.href}>
                  {/* Tooltip visible when sidebar is collapsed (under 1024px or manually collapsed) */}
                  <div className={isManuallyCollapsed ? "block" : "block lg:hidden"}>
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="font-semibold">
                        {item.label} {item.badge && `(${item.badge})`}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Standard link without tooltip on desktop when expanded */}
                  <div className={isManuallyCollapsed ? "hidden" : "hidden lg:block"}>
                    {linkContent}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer info & accent dot */}
        <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div
            className={`flex items-center gap-2 ${
              isManuallyCollapsed ? "hidden" : "hidden lg:flex"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-tenant-primary" />
            <span className="text-[11px]">AI Multi-Tenant</span>
          </div>

          <span
            className="h-2.5 w-2.5 rounded-full mx-auto lg:mx-0 shrink-0 border border-black/10"
            style={{ backgroundColor: tenantConfig.theme.accentColor }}
            title={`Active Accent: ${tenantConfig.theme.accentColor}`}
          />
        </div>
      </aside>
    </TooltipProvider>
  );
}
