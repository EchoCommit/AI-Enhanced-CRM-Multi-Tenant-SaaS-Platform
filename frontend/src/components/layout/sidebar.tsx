import Link from "next/link";
import { LayoutDashboard, Users, GitBranch, Mail, Bot, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/deals/sales-pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/sequences", label: "Sequences", icon: Mail },
  { href: "/ai", label: "AI Insights", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card p-4 flex flex-col justify-between h-screen">
      <div>
        <div className="flex items-center gap-2 px-2 py-4 mb-4">
          <div className="h-8 w-8 rounded-lg bg-tenant-primary text-primary-foreground flex items-center justify-center font-bold">
            N
          </div>
          <span className="font-semibold text-lg">Nexus CRM</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-border pt-4 text-xs text-muted-foreground">
        Nexus Multi-Tenant SaaS
      </div>
    </aside>
  );
}
