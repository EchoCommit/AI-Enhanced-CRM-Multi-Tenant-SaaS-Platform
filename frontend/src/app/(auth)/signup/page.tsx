"use client";

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
import { User, Mail, KeyRound, Building2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

// Zod Schema for Signup
const signupSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      orgName: "",
    },
  });

  const onSignupSubmit = async (values: SignupFormValues) => {
    clearError();
    const success = await signup(values);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-card border border-border rounded-xl shadow-lg space-y-6 font-tenant max-w-md w-full mx-auto">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
          Create Account <Sparkles className="h-4 w-4 text-tenant-primary" />
        </h2>
        <p className="text-xs text-muted-foreground">
          Register your organization to launch your AI-enhanced CRM workspace.
        </p>
      </div>

      {/* API Error Banner */}
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2 animate-in fade-in-0">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block">Registration Error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Signup Form */}
      <Form {...signupForm}>
        <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
          {/* Full Name Field */}
          <FormField
            control={signupForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-tenant-primary" /> Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Sarah Connor"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Work Email Field */}
          <FormField
            control={signupForm.control}
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
                    placeholder="sarah@cyberdyne.com"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Organization Name Field */}
          <FormField
            control={signupForm.control}
            name="orgName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-tenant-primary" /> Organization Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Cyberdyne Systems"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-tenant-primary" /> Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Min 8 chars, 1 upper, 1 number"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-tenant-primary hover:opacity-90 text-white font-semibold py-2.5 h-10 shadow"
            isLoading={isLoading}
          >
            Create Organization Workspace <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>

      {/* Footer link */}
      <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-tenant-primary font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
