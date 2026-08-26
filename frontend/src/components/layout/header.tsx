export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="text-sm font-medium text-muted-foreground">
        Workspace: <span className="text-foreground font-semibold">Demo Tenant</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium text-xs">
          US
        </div>
      </div>
    </header>
  );
}
