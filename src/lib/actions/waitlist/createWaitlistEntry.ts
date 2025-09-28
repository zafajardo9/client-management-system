import { WaitlistEventType, WaitlistStatus } from "@prisma/client";

import { db } from "../../db";
import { createWaitlistEntrySchema } from "../../validators";
import type { ActionResult } from "../types";

export async function createWaitlistEntry(
  input: unknown
): Promise<ActionResult<{ id: string; status: WaitlistStatus }>> {
  const parsed = createWaitlistEntrySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "INVALID_INPUT",
        message: "Invalid waitlist entry payload.",
        details: parsed.error.flatten(),
      },
    };
  }

  const data = parsed.data;
  const normalizedEmail = data.email.trim().toLowerCase();

  try {
    const existing = await db.waitlistEntry.findUnique({ where: { email: normalizedEmail } });

    if (existing) {
      const updated = await db.waitlistEntry.update({
        where: { id: existing.id },
        data: {
          fullName: data.fullName ?? undefined,
          company: data.company ?? undefined,
          goals: data.goals ?? undefined,
          source: data.source ?? undefined,
          notes: data.notes ?? undefined,
          metadata: data.metadata ?? undefined,
        },
      });

      await db.waitlistEvent.create({
        data: {
          entryId: updated.id,
          type: WaitlistEventType.NOTE,
          notes: data.notes ?? undefined,
          payload: {
            reason: "resubmitted",
            source: data.source ?? existing.source ?? null,
          },
        },
      });

      return { success: true, data: { id: updated.id, status: updated.status } };
    }

    const created = await db.waitlistEntry.create({
      data: {
        email: normalizedEmail,
        fullName: data.fullName ?? null,
        company: data.company ?? null,
        goals: data.goals ?? null,
        source: data.source ?? null,
        notes: data.notes ?? null,
        metadata: data.metadata ?? undefined,
        status: WaitlistStatus.PENDING,
      },
    });

    await db.waitlistEvent.create({
      data: {
        entryId: created.id,
        type: WaitlistEventType.COMMUNICATION,
        payload: {
          source: data.source ?? null,
        },
      },
    });

    return { success: true, data: { id: created.id, status: created.status } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
