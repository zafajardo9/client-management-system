import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import type { ActionResult } from "../types";

export async function archiveProject(id: string): Promise<ActionResult<{ id: string; isArchived: boolean }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const project = await db.project.findUnique({ where: { id }, select: { id: true, ownerId: true, isArchived: true } });
    if (!project) {
      return { success: false, error: { code: "NOT_FOUND", message: "Project not found." } };
    }

    if (project.ownerId !== user.id) {
      return { success: false, error: { code: "FORBIDDEN", message: "Only the owner can archive a project." } };
    }

    const updated = await db.project.update({ where: { id }, data: { isArchived: true }, select: { id: true, isArchived: true } });
    return { success: true, data: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
