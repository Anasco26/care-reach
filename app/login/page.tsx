"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { useAuth, dashboardPath } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const form = useForm<LoginValues, unknown, LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setFormError("");
    const result = await login(values.email, values.password);
    if (!result.ok) {
      setFormError(result.error ?? "Unable to sign in");
      return;
    }

    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    let role: "ADMIN" | "DOCTOR" | "PATIENT" = "PATIENT";
    if (userId) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      const list = (roles ?? []).map((r) => r.role);
      if (list.includes("ADMIN")) role = "ADMIN";
      else if (list.includes("DOCTOR")) role = "DOCTOR";
    }

    toast.success("Welcome back");
    router.replace(dashboardPath(role));
  }

  return (
    <AuthShell
      title="Sign in"
      description="Use a demo account: admin@clinic.com, doctor1@clinic.com or patient1@clinic.com with password Password123@"
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {formError ? (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          ) : null}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
