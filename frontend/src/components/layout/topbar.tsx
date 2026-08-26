"use client";

import { useState } from "react";
import Link from "next/link";
import { useThemeStore } from "@/stores";
import { ThemeSwitcher } from "./theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface TopBarProps {
  onOpenCommandPalette: () => void;
}

export function TopBar({ onOpenCommandPalette }: TopBarProps) {
  const { tenantConfig } = useThemeStore();
  const [unreadCount, setUnreadCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    {
      id: "1",
      title: "Lead Score Alert",
      desc: "Acme Corp score increased to 94.2% conversion probability.",
      time: "5m ago",
      read: false,
    },
    {
      id: "2",
      title: "Sequence Activity",
      desc: "Sarah Connor opened email step #2 in Outreach Sequence.",
      time: "25m ago",
      read: false,
    },
    {
      id: "3",
      title: "Deal Closed",
      desc: "Cyberdyne Systems $120,000 deal moved to Closed Won.",
      time: "1h ago",
      read: false,
    },
  ];

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between font-tenant sticky top-0 z-30">
      {/* Left: Tenant Branding Logo & Name */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          {tenantConfig.theme.logoUrl && tenantConfig.theme.logoUrl.endsWith(".svg") ? (
            <div className="h-8 w-8 rounded-lg bg-tenant-primary/10 border border-tenant-primary/20 flex items-center justify-center p-1 text-tenant-primary group-hover:scale-105 transition-transform">
              <span className="font-bold text-sm text-tenant-primary">
                {tenantConfig.name.charAt(0)}
              </span>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-lg bg-tenant-primary text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              {tenantConfig.name.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-sm text-foreground tracking-tight leading-none">
              {tenantConfig.name}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Enterprise Tenant
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Command Palette Trigger Input Button */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-border bg-background/60 hover:bg-accent/50 text-muted-foreground text-xs transition-colors shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-tenant-primary" />
            <span className="hidden sm:inline">Search CRM, actions or AI commands...</span>
            <span className="sm:hidden">Search...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground bg-muted border border-border rounded">
            <span className="text-[9px]">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Notification Icon, Dev Theme Switcher & User Avatar Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dev Testing Theme Switcher */}
        <ThemeSwitcher />

        {/* Notifications Dropdown */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <button
              className="relative p-2 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-tenant-primary text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
              <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-tenant-primary" /> Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => setUnreadCount(0)}
                  className="text-[10px] text-tenant-primary hover:underline font-medium flex items-center gap-1"
                >
                  <CheckCircle2 className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {mockNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 text-xs space-y-1 hover:bg-accent/40 transition-colors ${
                    !n.read && unreadCount > 0 ? "bg-tenant-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-tenant-primary" /> {n.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {n.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-border bg-muted/20 text-center">
              <Link
                href="/settings?tab=notifications"
                className="text-[11px] text-tenant-primary hover:underline font-medium"
              >
                Notification Preferences
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-full border border-border hover:border-tenant-primary/50 transition-colors focus:outline-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar-user.png" alt="Ayush User" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold leading-none text-foreground">
                  Ayush Sharma
                </p>
                <p className="text-[11px] leading-none text-muted-foreground">
                  ayush@nexus-crm.io
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Workspace Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenCommandPalette} className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Command Palette (⌘K)</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="https://docs.nexus-crm.io" target="_blank" className="flex items-center gap-2">
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Help & Documentation</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
              <Link href="/login" className="flex items-center gap-2">
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
