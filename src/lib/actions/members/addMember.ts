import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import type { ActionResult } from "../types";
import { addMemberSchema } from "../../validators";

export async function addMember(
  input: z.infer<typeof addMemberSchema>
): Promise<ActionResult<{ id: string; projectId: string; userId: string; role: "EDITOR" | "VIEWER" | "OWNER" }>> {
  try {
    const parsed = addMemberSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid input.", details: parsed.error.flatten() },
      };
    }

    const { projectId, userId, role } = parsed.data;
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const me = await db.user.findUnique({ where: { clerkUserId } });
    if (!me) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const project = await db.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return { success: false, error: { code: "NOT_FOUND", message: "Project not found." } };
    }

    if (project.ownerId !== me.id) {
      return { success: false, error: { code: "FORBIDDEN", message: "Only the owner can manage members." } };
    }

    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return { success: false, error: { code: "NOT_FOUND", message: "Target user not found." } };
    }

    const existing = await db.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    let member;
    if (existing) {
      member = await db.projectMember.update({
        where: { projectId_userId: { projectId, userId } },
        data: { role },
        select: { id: true, projectId: true, userId: true, role: true },
      });
    } else {
      member = await db.projectMember.create({
        data: { projectId, userId, role },
        select: { id: true, projectId: true, userId: true, role: true },
      });
    }

    return { success: true, data: member };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
