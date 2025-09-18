import { z } from "zod";
import { db } from "../../db";
import { updateUpdateSchema } from "../../validators";
import type { ActionResult } from "../types";

export async function updateUpdate(
  input: z.infer<typeof updateUpdateSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    const updated = await db.update.update({
      where: { id: input.updateId },
      data: {
        title: input.title ?? undefined,
        bodyMd: input.bodyMd ?? undefined,
        tags: input.tags ?? undefined,
        status: input.status ?? undefined,
      },
      select: { id: true },
    });
    return { success: true, data: { id: updated.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
