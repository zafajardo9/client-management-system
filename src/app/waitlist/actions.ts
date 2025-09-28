"use server";

import { waitlist } from "@/lib/actions";
import { createWaitlistEntrySchema } from "@/lib/validators";
import type { WaitlistFormState } from "./types";

export async function joinWaitlistAction(
  _prevState: WaitlistFormState,
  formData: FormData
): Promise<WaitlistFormState> {
  const email = formData.get("email");
  const fullName = formData.get("fullName");
  const company = formData.get("company");
  const goals = formData.get("goals");
  const source = formData.get("source");
  const notes = formData.get("notes");

  const candidate = {
    email: typeof email === "string" ? email : "",
    fullName: typeof fullName === "string" && fullName.length > 0 ? fullName : undefined,
    company: typeof company === "string" && company.length > 0 ? company : undefined,
    goals: typeof goals === "string" && goals.length > 0 ? goals : undefined,
    source: typeof source === "string" && source.length > 0 ? source : undefined,
    notes: typeof notes === "string" && notes.length > 0 ? notes : undefined,
  };

  const parsed = createWaitlistEntrySchema.safeParse(candidate);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      errors: Object.fromEntries(Object.entries(fieldErrors).filter(([, value]) => value && value.length > 0)) as Record<
        string,
        string[]
      >,
    };
  }

  const result = await waitlist.createWaitlistEntry(parsed.data);

  if (result.success) {
    return {
      status: "success",
      message: "You're on the list! We'll be in touch soon.",
    };
  }

  if (result.error.code === "INVALID_INPUT" && result.error.details && typeof result.error.details === "object") {
    const details = result.error.details as { fieldErrors?: Record<string, string[]> };
    const fieldErrors = details.fieldErrors ?? {};
    return {
      status: "error",
      message: result.error.message,
      errors: fieldErrors,
    };
  }

  return {
    status: "error",
    message: result.error.message ?? "Something went wrong while joining the waitlist.",
  };
}
