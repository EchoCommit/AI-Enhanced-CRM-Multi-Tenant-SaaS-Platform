export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Nexus CRM</h1>
          <p className="text-sm text-muted-foreground">
            AI-First Multi-Tenant Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
