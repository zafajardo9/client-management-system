import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import type { ActionResult } from "../types";
import { removeMemberSchema } from "../../validators";

export async function removeMember(
  input: z.infer<typeof removeMemberSchema>
): Promise<ActionResult<{ projectId: string; userId: string }>> {
  try {
    const parsed = removeMemberSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid input.", details: parsed.error.flatten() },
      };
    }

    const { projectId, userId } = parsed.data;

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

    await db.projectMember.delete({ where: { projectId_userId: { projectId, userId } } });

    return { success: true, data: { projectId, userId } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
