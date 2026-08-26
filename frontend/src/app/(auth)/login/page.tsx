import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="p-6 bg-card border border-border rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-center">Sign In</h2>
      <p className="text-sm text-muted-foreground text-center">
        Authentication form scaffold
      </p>
      <div className="pt-4 text-center text-xs text-muted-foreground">
        Need an account?{" "}
        <Link href="/signup" className="text-primary underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
