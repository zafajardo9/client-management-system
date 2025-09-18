"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AuthOAuthButtons } from "@/app/(auth)/components/AuthOAuthButtons";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const res = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        toast.success("Welcome back!");
        router.replace("/dashboard");
        return;
      }

      // Handle other statuses (needs_first_factor etc.) if enabled
      toast.error("Additional verification required. Please continue in the modal.");
    } catch (err: unknown) {
      const isClerkError = (e: unknown): e is { errors: Array<{ message?: string }> } => {
        if (typeof e !== "object" || e === null || !("errors" in e)) return false;
        const errorsVal = (e as { errors?: unknown }).errors;
        return Array.isArray(errorsVal);
      };
      const message = isClerkError(err)
        ? err.errors?.[0]?.message ?? "Sign in failed"
        : err instanceof Error
        ? err.message
        : "Sign in failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md w-full px-4">
      <Card className="p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Log in</h1>
          <p className="text-sm text-muted-foreground">Welcome back. Enter your credentials to continue.</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or continue with</span>
          </div>
        </div>
        <AuthOAuthButtons mode="sign-in" providers={["google"]} />
      </Card>
    </div>
  );
}
