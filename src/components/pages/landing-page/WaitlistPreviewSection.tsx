import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WaitlistPreviewSection() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <Card className="overflow-hidden border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:shadow-black/30">
        <CardHeader className="space-y-2 text-center sm:text-left">
          <CardTitle className="text-xl font-semibold sm:text-2xl">Preview what&apos;s next in Phase 2</CardTitle>
          <p className="text-sm text-muted-foreground sm:text-base">
            Join the waitlist to explore upcoming collaboration features, leave feedback, and secure early access invites for
            your team.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>• Real-time collaboration upgrades</span>
            <span>• Shareable client narratives</span>
            <span>• Advanced governance controls</span>
          </div>
          <Button asChild size="lg" className="min-w-[180px]">
            <Link href="/waitlist">View waitlist experience</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
