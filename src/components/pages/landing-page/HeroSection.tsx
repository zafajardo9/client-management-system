import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import EmptyState from "@/components/shared/EmptyState";

export function HeroSection() {
  const title = siteConfig.landing?.heroTitle;
  const description = siteConfig.landing?.heroDescription;

  if (!title || !description) {
    return (
      <div className="px-6">
        <EmptyState
          title="Missing hero content"
          description="Please provide landing.heroTitle and landing.heroDescription in src/config/site.ts."
        />
      </div>
    );
  }
  return (
    <section className="grid gap-8 md:grid-cols-2 items-center">
      <div className="space-y-5">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-base md:text-lg">{description}</p>
        <div className="flex flex-wrap gap-3">
          <SignedOut>
            <Button asChild size="lg">
              <Link href="/sign-up">Get started</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/sign-in">Log in</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild size="lg">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
      <div className="rounded-lg border p-6">
        <div className="text-sm text-muted-foreground">
          Fast, RSC-first dashboard with updates, share links, and collaboration.
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border p-3">Create Projects</div>
          <div className="rounded-md border p-3">Post Updates</div>
          <div className="rounded-md border p-3">Share Links</div>
          <div className="rounded-md border p-3">Collaborators</div>
        </div>
      </div>
    </section>
  );
}
