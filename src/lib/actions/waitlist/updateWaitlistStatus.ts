import { WaitlistEventType, WaitlistStatus } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

import { db } from "../../db";
import { updateWaitlistStatusSchema } from "../../validators";
import type { ActionResult } from "../types";

export async function updateWaitlistStatus(
  input: unknown
): Promise<ActionResult<{ id: string; status: WaitlistStatus }>> {
  const parsed = updateWaitlistStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "INVALID_INPUT",
        message: "Invalid waitlist status payload.",
        details: parsed.error.flatten(),
      },
    };
  }

  const { id, status, notes } = parsed.data;

  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in." },
      };
    }

    const entry = await db.waitlistEntry.findUnique({ where: { id } });
    if (!entry) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Waitlist entry not found." },
      };
    }

    const shouldSetConvertedAt = status === WaitlistStatus.CONVERTED;
    const shouldClearConvertedAt = entry.status === WaitlistStatus.CONVERTED && status !== WaitlistStatus.CONVERTED;

    const updated = await db.waitlistEntry.update({
      where: { id },
      data: {
        status,
        notes: notes ?? entry.notes,
        convertedAt: shouldSetConvertedAt ? new Date() : shouldClearConvertedAt ? null : entry.convertedAt,
      },
    });

    await db.waitlistEvent.create({
      data: {
        entryId: updated.id,
        type: WaitlistEventType.STATUS_CHANGE,
        notes: notes ?? undefined,
        payload: {
          previousStatus: entry.status,
          nextStatus: status,
        },
      },
    });

    return { success: true, data: { id: updated.id, status: updated.status } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
