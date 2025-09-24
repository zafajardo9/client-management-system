import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { db } from "../../db";
import type { ActionResult } from "../types";
import { updateMemberSchema } from "../../validators";

export async function updateMember(
  input: z.infer<typeof updateMemberSchema>
): Promise<ActionResult<{ projectId: string; userId: string; role: "EDITOR" | "VIEWER" }>> {
  try {
    const parsed = updateMemberSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input.",
          details: parsed.error.flatten(),
        },
      };
    }

    const { projectId, userId, role } = parsed.data;

    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in." },
      };
    }

    const me = await db.user.findUnique({ where: { clerkUserId } });
    if (!me) {
      return {
        success: false,
        error: { code: "USER_NOT_FOUND", message: "User profile not found." },
      };
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });
    if (!project) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found." },
      };
    }

    if (project.ownerId !== me.id) {
      return {
        success: false,
        error: { code: "FORBIDDEN", message: "Only the owner can manage members." },
      };
    }

    if (userId === project.ownerId) {
      return {
        success: false,
        error: {
          code: "INVALID_TARGET",
          message: "Use the ownership transfer flow to change owner privileges.",
        },
      };
    }

    const membership = await db.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { id: true },
    });

    if (!membership) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Member not found." },
      };
    }

    const updated = await db.projectMember.update({
      where: { projectId_userId: { projectId, userId } },
      data: { role },
      select: { projectId: true, userId: true, role: true },
    });

    return { success: true, data: { projectId: updated.projectId, userId: updated.userId, role: updated.role as "EDITOR" | "VIEWER" } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
