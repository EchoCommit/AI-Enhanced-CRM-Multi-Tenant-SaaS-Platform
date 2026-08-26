import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, Zap } from "lucide-react";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-tenant flex flex-col items-center justify-center p-6 text-center space-y-8 relative">
      <div className="absolute top-6 right-6">
        <ThemeSwitcher />
      </div>

      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-tenant-primary/10 text-tenant-primary border border-tenant-primary/20">
          <Zap className="h-3.5 w-3.5" /> AI-Enhanced Multi-Tenant SaaS
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Hello Nexus
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl">
          Next.js 14 App Router frontend with per-tenant dynamic theme injection,
          CSS custom properties, localStorage caching, Zustand, and Tailwind utility bindings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full text-left">
        <div className="p-4 rounded-lg border border-border bg-card space-y-2">
          <Bot className="h-6 w-6 text-tenant-primary" />
          <h3 className="font-semibold text-sm">Lead Scoring Engine</h3>
          <p className="text-xs text-muted-foreground">
            XGBoost model predicting lead conversion probability (AUC 0.9576).
          </p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card space-y-2">
          <ShieldCheck className="h-6 w-6 text-tenant-accent" />
          <h3 className="font-semibold text-sm">Multi-Tenant Theming</h3>
          <p className="text-xs text-muted-foreground">
            Dynamic injection into :root, localStorage caching & Tailwind variables.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card space-y-2">
          <Zap className="h-6 w-6 text-tenant-primary" />
          <h3 className="font-semibold text-sm">Deal Forecasting</h3>
          <p className="text-xs text-muted-foreground">
            Real-time deal close probability scoring and pipeline metrics.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-tenant-primary text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          Open App Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-card text-sm font-medium hover:bg-accent transition-colors"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
