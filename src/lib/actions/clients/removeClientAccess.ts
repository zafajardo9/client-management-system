import { auth } from "@clerk/nextjs/server";
import type { PrismaClient } from "@prisma/client";

import { db } from "../../db";
import type { ActionResult } from "../types";
import { removeClientAccessSchema, type RemoveClientAccessInput } from "@/lib/validators";

const prisma = db as PrismaClient;

export async function removeClientAccess(input: RemoveClientAccessInput): Promise<ActionResult<{ success: true }>> {
  try {
    const parsed = removeClientAccessSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: { code: "INVALID_INPUT", message: "Invalid client removal payload.", details: parsed.error.flatten() },
      };
    }

    const { projectId, clientAccessId } = parsed.data;

    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const me = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } });
    if (!me) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const access = await prisma.clientProjectAccess.findUnique({
      where: { id: clientAccessId },
      select: {
        id: true,
        projectId: true,
        project: { select: { ownerId: true } },
      },
    });

    if (!access || access.projectId !== projectId) {
      return { success: false, error: { code: "NOT_FOUND", message: "Client access not found." } };
    }

    if (access.project.ownerId !== me.id) {
      return { success: false, error: { code: "FORBIDDEN", message: "Only the project owner can manage clients." } };
    }

    await prisma.clientTagAssignment.deleteMany({ where: { accessId: clientAccessId } });
    await prisma.clientProjectAccess.delete({ where: { id: clientAccessId } });

    return { success: true, data: { success: true } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
