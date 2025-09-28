import { Metadata } from "next";
import { Suspense } from "react";

import { WaitlistForm, WaitlistHero, WaitlistTestimonials } from "@/components/pages/waitlist";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description: "Be the first to know when Client Management System Phase 2 launches.",
};

export default function WaitlistPage() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <WaitlistHero />
        <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading waitlist form…</div>}>
          <WaitlistForm />
        </Suspense>
        <WaitlistTestimonials />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-200/80 to-transparent dark:from-slate-900/90"
        aria-hidden="true"
      />
    </div>
  );
}
