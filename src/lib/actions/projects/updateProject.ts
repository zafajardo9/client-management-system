import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import { updateProjectSchema } from "../../validators";
import type { ActionResult } from "../types";

export async function updateProject(
  input: z.infer<typeof updateProjectSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };

    const project = await db.project.findUnique({ where: { id: input.id }, select: { owner: { select: { clerkUserId: true } } } });
    if (!project || project.owner.clerkUserId !== userId) {
      return { success: false, error: { code: "FORBIDDEN", message: "You cannot edit this project." } };
    }

    const updated = await db.project.update({
      where: { id: input.id },
      data: {
        name: input.name ?? undefined,
        description: input.description ?? undefined,
        isArchived: input.isArchived ?? undefined,
      },
      select: { id: true },
    });

    return { success: true, data: { id: updated.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
