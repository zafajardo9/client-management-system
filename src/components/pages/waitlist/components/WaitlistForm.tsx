"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { joinWaitlistAction } from "@/app/waitlist/actions";
import { initialWaitlistFormState } from "@/app/waitlist/types";

export default function WaitlistForm() {
  const [state, formAction] = useFormState(joinWaitlistAction, initialWaitlistFormState);

  useEffect(() => {
    if (state.status === "success") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.status]);

  return state.status === "success" ? (
    <div className="mx-auto max-w-2xl text-center" aria-live="polite">
      <Card className="border-emerald-200 bg-emerald-50/60">
        <CardHeader>
          <CardTitle className="text-emerald-700">You’re on the list!</CardTitle>
          <CardDescription className="text-emerald-700/80">
            We’ll reach out as soon as Phase 2 early access opens up. Watch your inbox for updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-emerald-900">
          In the meantime, keep an eye on our changelog for sneak peeks, and feel free to invite teammates who should join
          the journey.
        </CardContent>
      </Card>
    </div>
  ) : (
    <form action={formAction} className="mx-auto grid w-full max-w-2xl gap-6" aria-live="polite">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle>Join the waitlist</CardTitle>
          <CardDescription>Tell us a bit about you so we can tailor the early access experience.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" name="email" type="email" placeholder="you@company.com" required aria-invalid={Boolean(state.errors?.email)} />
            {state.errors?.email ? <FieldErrors errors={state.errors.email} /> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" placeholder="Jordan Smith" aria-invalid={Boolean(state.errors?.fullName)} />
            {state.errors?.fullName ? <FieldErrors errors={state.errors.fullName} /> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company / Team</Label>
            <Input id="company" name="company" placeholder="Nimbus Studio" aria-invalid={Boolean(state.errors?.company)} />
            {state.errors?.company ? <FieldErrors errors={state.errors.company} /> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goals">What do you hope to accomplish?</Label>
            <Textarea
              id="goals"
              name="goals"
              placeholder="Share the collaboration or client workflows you want to upgrade"
              rows={4}
              aria-invalid={Boolean(state.errors?.goals)}
            />
            {state.errors?.goals ? <FieldErrors errors={state.errors.goals} /> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="source">How did you hear about us?</Label>
            <Input id="source" name="source" placeholder="Podcast, referral, community, etc." aria-invalid={Boolean(state.errors?.source)} />
            {state.errors?.source ? <FieldErrors errors={state.errors.source} /> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Anything else we should know?</Label>
            <Textarea id="notes" name="notes" rows={3} aria-invalid={Boolean(state.errors?.notes)} />
            {state.errors?.notes ? <FieldErrors errors={state.errors.notes} /> : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            We respect your inbox. Expect curated updates covering roadmap milestones and early access invitations.
          </p>
          <SubmitButton />
        </CardFooter>
        {state.status === "error" && state.message ? (
          <div className="px-6 pb-6">
            <Alert variant="destructive">
              <AlertTitle>We couldn’t process that</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          </div>
        ) : null}
      </Card>
    </form>
  );
}

function FieldErrors({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <ul className="space-y-1 text-xs text-destructive">
      {errors.map((error, index) => (
        <li key={`${error}-${index}`}>{error}</li>
      ))}
    </ul>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[140px]">
      {pending ? "Submitting…" : "Join waitlist"}
    </Button>
  );
}
