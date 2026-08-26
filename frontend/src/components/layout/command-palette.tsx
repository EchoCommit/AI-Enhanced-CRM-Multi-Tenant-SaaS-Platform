"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import {
  Search,
  LayoutDashboard,
  Users,
  GitBranch,
  Mail,
  Bot,
  Settings,
  PlusCircle,
  Sparkles,
  FileText,
  ArrowRight,
} from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Quick Actions" | "AI Assistance";
  icon: React.ElementType;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: externalOpen, onOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = useCallback(
    (value: boolean) => {
      if (onOpenChange) {
        onOpenChange(value);
      } else {
        setInternalOpen(value);
      }
      if (!value) {
        setQuery("");
        setSelectedIndex(0);
      }
    },
    [onOpenChange]
  );

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);


  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "nav-dashboard",
        title: "Go to Dashboard",
        category: "Navigation",
        icon: LayoutDashboard,
        action: () => router.push("/dashboard"),
        keywords: ["home", "analytics", "metrics"],
      },
      {
        id: "nav-contacts",
        title: "Go to Contacts",
        category: "Navigation",
        icon: Users,
        action: () => router.push("/contacts"),
        keywords: ["leads", "customers", "people"],
      },
      {
        id: "nav-deals",
        title: "Go to Pipeline / Deals",
        category: "Navigation",
        icon: GitBranch,
        action: () => router.push("/deals/sales-pipeline"),
        keywords: ["sales", "pipeline", "opportunities"],
      },
      {
        id: "nav-sequences",
        title: "Go to Sequences",
        category: "Navigation",
        icon: Mail,
        action: () => router.push("/sequences"),
        keywords: ["email", "outreach", "campaigns"],
      },
      {
        id: "nav-ai",
        title: "Go to AI Insights",
        category: "Navigation",
        icon: Bot,
        action: () => router.push("/ai"),
        keywords: ["scoring", "predictions", "models"],
      },
      {
        id: "nav-settings",
        title: "Go to Settings",
        category: "Navigation",
        icon: Settings,
        action: () => router.push("/settings"),
        keywords: ["tenant", "preferences", "account"],
      },

      // Quick Actions
      {
        id: "action-new-lead",
        title: "Create New Lead",
        category: "Quick Actions",
        icon: PlusCircle,
        action: () => router.push("/contacts?action=new"),
        keywords: ["add", "contact", "create"],
      },
      {
        id: "action-log-activity",
        title: "Log Sales Activity",
        category: "Quick Actions",
        icon: FileText,
        action: () => router.push("/deals/sales-pipeline?action=log"),
        keywords: ["note", "call", "meeting"],
      },

      // AI Assistance
      {
        id: "ai-score-leads",
        title: "Score Pipeline Leads (AI)",
        category: "AI Assistance",
        icon: Sparkles,
        action: () => router.push("/ai?tab=lead-scoring"),
        keywords: ["predict", "conversion", "xgboost"],
      },
      {
        id: "ai-generate-email",
        title: "Generate AI Email Sequence",
        category: "AI Assistance",
        icon: Sparkles,
        action: () => router.push("/sequences?action=generate"),
        keywords: ["draft", "outreach", "copywriter"],
      },
    ],
    [router]
  );

  // Filter commands by search query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase().trim();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(lower) ||
        cmd.category.toLowerCase().includes(lower) ||
        cmd.keywords?.some((kw) => kw.toLowerCase().includes(lower))
    );
  }, [commands, query]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogOverlay />
      <DialogContent
        onKeyDown={handleKeyDown}
        className="p-0 max-w-xl overflow-hidden gap-0 border-border bg-card shadow-2xl rounded-xl"
      >
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-border bg-background/50">
          <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search (e.g. Dashboard, AI Score, Contacts)..."
            className="w-full h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3 font-tenant">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching commands or pages found.
            </div>
          ) : (
            <>
              {(["Navigation", "Quick Actions", "AI Assistance"] as const).map(
                (category) => {
                  const categoryItems = filteredCommands.filter(
                    (c) => c.category === category
                  );
                  if (categoryItems.length === 0) return null;

                  return (
                    <div key={category} className="space-y-1">
                      <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {category}
                      </div>
                      {categoryItems.map((item) => {
                        const globalIndex = filteredCommands.findIndex(
                          (c) => c.id === item.id
                        );
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              item.action();
                              setIsOpen(false);
                            }}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                              isSelected
                                ? "bg-tenant-primary text-white font-medium"
                                : "text-foreground hover:bg-accent"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon
                                className={`h-4 w-4 ${
                                  isSelected ? "text-white" : "text-tenant-primary"
                                }`}
                              />
                              <span>{item.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {isSelected && (
                                <ArrowRight className="h-3.5 w-3.5 text-white/80" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                }
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-border bg-muted/30 text-[11px] text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 text-[10px] bg-card border rounded">↑</kbd>{" "}
              <kbd className="px-1 py-0.5 text-[10px] bg-card border rounded">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 text-[10px] bg-card border rounded">↵</kbd> Select
            </span>
          </div>
          <span>Nexus AI CRM Command Palette</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
