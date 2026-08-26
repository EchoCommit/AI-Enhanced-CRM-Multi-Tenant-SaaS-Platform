"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/stores";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle, Building2, KeyRound, Mail, ArrowRight } from "lucide-react";

// Zod Schema for Login
const loginSchema = z.object({
  tenantSubdomain: z
    .string()
    .min(1, "Tenant subdomain is required")
    .regex(/^[a-zA-Z0-9-]+$/, "Subdomain can only contain alphanumeric characters and hyphens"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Zod Schema for MFA
const mfaSchema = z.object({
  code: z
    .string()
    .min(6, "MFA code must be 6 digits")
    .max(6, "MFA code must be 6 digits")
    .regex(/^[0-9]{6}$/, "Code must contain digits only"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type MfaFormValues = z.infer<typeof mfaSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, verifyMfa, mfaRequired, mfaToken, isLoading, error, clearError } = useAuthStore();
  const [localMfaError, setLocalMfaError] = useState<string | null>(null);

  // Login Form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tenantSubdomain: "demo",
      email: "",
      password: "",
    },
  });

  // MFA Form setup
  const mfaForm = useForm<MfaFormValues>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      code: "123456",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    clearError();
    setLocalMfaError(null);
    const success = await login(values);
    if (success) {
      router.push("/dashboard");
    }
  };

  const onMfaSubmit = async (values: MfaFormValues) => {
    clearError();
    setLocalMfaError(null);
    if (!mfaToken) return;
    const success = await verifyMfa({ mfa_token: mfaToken, code: values.code });
    if (success) {
      router.push("/dashboard");
    } else {
      setLocalMfaError("Invalid MFA verification code. Use test code 123456.");
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-card border border-border rounded-xl shadow-lg space-y-6 font-tenant max-w-md w-full mx-auto">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {mfaRequired ? "Two-Factor Verification" : "Sign In to Nexus"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {mfaRequired
            ? "Enter the 6-digit authentication code sent to your device."
            : "Enter your tenant domain credentials to access your workspace."}
        </p>
      </div>

      {/* API Error Banner */}
      {(error || localMfaError) && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2 animate-in fade-in-0">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block">Authentication Error</span>
            <span>{error || localMfaError}</span>
          </div>
        </div>
      )}

      {!mfaRequired ? (
        /* Standard Login Form */
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            {/* Tenant Subdomain Field */}
            <FormField
              control={loginForm.control}
              name="tenantSubdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-tenant-primary" /> Tenant Subdomain
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center rounded-md border border-border bg-background focus-within:ring-1 focus-within:ring-ring">
                      <Input
                        {...field}
                        placeholder="demo"
                        disabled={isLoading}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-r-none"
                      />
                      <span className="px-3 text-xs font-medium text-muted-foreground bg-muted/40 border-l border-border py-2 rounded-r-md">
                        .nexus-crm.io
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-tenant-primary" /> Work Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="alex.smith@acme.com"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-tenant-primary" /> Password
                    </span>
                    <Link
                      href="#"
                      className="text-[11px] text-tenant-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Password reset functionality scaffold");
                      }}
                    >
                      Forgot?
                    </Link>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Demo Hint */}
            <div className="p-2.5 rounded-md bg-muted/40 border border-border text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-tenant-primary" /> Test Credentials:
              </p>
              <p>Email: <code className="font-mono text-foreground">admin@nexus.io</code> (or <code className="font-mono text-foreground">mfa@nexus.io</code> for 2FA flow)</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-tenant-primary hover:opacity-90 text-white font-semibold py-2.5 h-10 shadow"
              isLoading={isLoading}
            >
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      ) : (
        /* MFA Verification Form */
        <Form {...mfaForm}>
          <form onSubmit={mfaForm.handleSubmit(onMfaSubmit)} className="space-y-4">
            <div className="p-3 rounded-lg bg-tenant-primary/10 border border-tenant-primary/20 text-xs text-tenant-primary flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Multi-Factor Authentication is active for this tenant account.</span>
            </div>

            <FormField
              control={mfaForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-tenant-primary" /> 6-Digit Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123456"
                      maxLength={6}
                      disabled={isLoading}
                      className="text-center tracking-widest text-lg font-mono"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-[11px] text-muted-foreground text-center">
              Test MFA Passcode: <code className="font-mono font-bold text-foreground">123456</code>
            </p>

            <Button
              type="submit"
              className="w-full bg-tenant-primary hover:opacity-90 text-white font-semibold py-2.5 h-10 shadow"
              isLoading={isLoading}
            >
              Verify & Continue
            </Button>
          </form>
        </Form>
      )}

      {/* Footer link */}
      <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
        Need an account for your organization?{" "}
        <Link href="/signup" className="text-tenant-primary font-semibold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
