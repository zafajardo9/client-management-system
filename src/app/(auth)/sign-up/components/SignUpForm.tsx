"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AuthOAuthButtons } from "@/app/(auth)/components/AuthOAuthButtons";

const schema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((vals) => vals.password === vals.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const verifyForm = useForm<{ code: string }>({
    defaultValues: { code: "" },
  });

  async function onSubmit(values: FormValues) {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingEmail(values.email);
      setVerificationStep(true);
      toast.message("We sent a verification code to your email.");
    } catch (err: unknown) {
      const isClerkError = (e: unknown): e is { errors: Array<{ message?: string }> } => {
        if (typeof e !== "object" || e === null || !("errors" in e)) return false;
        const errorsVal = (e as { errors?: unknown }).errors;
        return Array.isArray(errorsVal);
      };
      const message = isClerkError(err)
        ? err.errors?.[0]?.message ?? "Sign up failed"
        : err instanceof Error
        ? err.message
        : "Sign up failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function onVerify(values: { code: string }) {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code: values.code });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        toast.success("Account created!");
        router.replace("/dashboard");
        return;
      }
      toast.error("Verification not complete. Please try again.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid code";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md w-full px-4">
      <Card className="p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            {verificationStep ? "Enter the code we sent to your email." : "Start by entering your details"}
          </p>
        </div>

        {!verificationStep ? (
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
            <div className="grid gap-1">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" {...form.register("confirmPassword")} />
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-4">
            <div className="grid gap-1">
              <Label htmlFor="code">Verification code</Label>
              <Input id="code" inputMode="numeric" placeholder="123456" {...verifyForm.register("code")} />
              {pendingEmail && (
                <p className="text-xs text-muted-foreground">Sent to {pendingEmail}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify and continue"}
            </Button>
          </form>
        )}

        {!verificationStep && (
          <>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>
            <AuthOAuthButtons mode="sign-up" providers={["google"]} />
          </>
        )}
      </Card>
    </div>
  );
}
