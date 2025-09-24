import { auth } from "@clerk/nextjs/server";

import { ensureUser } from "../../auth/ensureUser";
import { db } from "../../db";
import type { ActionResult } from "../types";

export async function deleteProject(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const user = await ensureUser();
    if (!user) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const project = await db.project.findUnique({ where: { id }, select: { id: true, ownerId: true } });
    if (!project) {
      return { success: false, error: { code: "NOT_FOUND", message: "Project not found." } };
    }

    if (project.ownerId !== user.id) {
      return { success: false, error: { code: "FORBIDDEN", message: "Only the owner can delete a project." } };
    }

    await db.$transaction(async (tx) => {
      await tx.update.deleteMany({ where: { projectId: id } });
      await tx.projectMember.deleteMany({ where: { projectId: id } });
      await tx.shareLink.deleteMany({ where: { projectId: id } });
      await tx.project.delete({ where: { id } });
    });

    return { success: true, data: { id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
