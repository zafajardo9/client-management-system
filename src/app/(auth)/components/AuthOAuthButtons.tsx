"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Provider = "google" | "github";

type Props = {
  mode: "sign-in" | "sign-up";
  providers?: Provider[];
};

export function AuthOAuthButtons({ mode, providers = ["google", "github"] }: Props) {
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const [loading, setLoading] = useState<Provider | null>(null);

  const onProvider = async (provider: Provider) => {
    setLoading(provider);
    try {
      const strategy = provider === "google" ? "oauth_google" : "oauth_github";
      if (mode === "sign-in") {
        if (!signInLoaded || !signIn) return;
        await signIn.authenticateWithRedirect({
          strategy,
          redirectUrl: "/",
          redirectUrlComplete: "/dashboard",
        });
      } else {
        if (!signUpLoaded || !signUp) return;
        await signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: "/",
          redirectUrlComplete: "/dashboard",
        });
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-2">
      {providers.includes("google") && (
        <Button variant="outline" className="w-full" onClick={() => onProvider("google")} disabled={loading !== null}>
          {loading === "google" ? "Redirecting..." : "Continue with Google"}
        </Button>
      )}
      {providers.includes("github") && (
        <Button variant="outline" className="w-full" onClick={() => onProvider("github")} disabled={loading !== null}>
          {loading === "github" ? "Redirecting..." : "Continue with GitHub"}
        </Button>
      )}
    </div>
  );
}
