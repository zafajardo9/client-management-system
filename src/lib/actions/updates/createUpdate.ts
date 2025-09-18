import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import { createUpdateSchema } from "../../validators";
import type { ActionResult } from "../types";

export async function createUpdate(
  input: z.infer<typeof createUpdateSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };

    const project = await db.project.findUnique({ where: { id: input.projectId }, select: { owner: { select: { clerkUserId: true } }, members: { select: { user: { select: { clerkUserId: true } } } } } });
    const canEdit =
      project &&
      (project.owner.clerkUserId === userId ||
        project.members.some((m: { user: { clerkUserId: string } }) => m.user.clerkUserId === userId));
    if (!canEdit) return { success: false, error: { code: "FORBIDDEN", message: "You cannot post updates to this project." } };

    const update = await db.update.create({
      data: {
        projectId: input.projectId,
        title: input.title,
        bodyMd: input.bodyMd,
        tags: input.tags ?? [],
        status: input.status ?? "PUBLISHED",
        createdBy: userId,
      },
      select: { id: true },
    });

    return { success: true, data: { id: update.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
