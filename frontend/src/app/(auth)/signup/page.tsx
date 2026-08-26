import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="p-6 bg-card border border-border rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-center">Create Account</h2>
      <p className="text-sm text-muted-foreground text-center">
        Registration form scaffold
      </p>
      <div className="pt-4 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
