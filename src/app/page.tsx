import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-5">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Share project updates with clients effortlessly
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Create projects, publish changelogs, and securely share progress with clients. Collaborate with your team using roles.
          </p>
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
    </main>
  );
}
