import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { db } from "../../db";
import type { ActionResult } from "../types";
import { transferOwnershipSchema } from "../../validators";

export async function transferOwnership(
  input: z.infer<typeof transferOwnershipSchema>
): Promise<ActionResult<{ projectId: string; ownerId: string }>> {
  try {
    const parsed = transferOwnershipSchema.safeParse(input);
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

    const { projectId, targetUserId } = parsed.data;

    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in." },
      };
    }

    const currentOwner = await db.user.findUnique({ where: { clerkUserId } });
    if (!currentOwner) {
      return {
        success: false,
        error: { code: "USER_NOT_FOUND", message: "User profile not found." },
      };
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true, ownerId: true, isArchived: true },
    });
    if (!project) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found." },
      };
    }

    if (project.isArchived) {
      return {
        success: false,
        error: {
          code: "BAD_STATE",
          message: "Cannot transfer ownership of an archived project.",
        },
      };
    }

    if (project.ownerId !== currentOwner.id) {
      return {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Only the current owner can transfer ownership.",
        },
      };
    }

    if (targetUserId === currentOwner.id) {
      return {
        success: false,
        error: {
          code: "INVALID_TARGET",
          message: "You already own this project.",
        },
      };
    }

    const targetUser = await db.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Target user not found." },
      };
    }

    const targetMembership = await db.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUserId } },
      select: { userId: true },
    });

    if (!targetMembership) {
      return {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Target user must be a collaborator on this project first.",
        },
      };
    }

    await db.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: projectId },
        data: { ownerId: targetUserId },
      });

      await tx.projectMember.upsert({
        where: { projectId_userId: { projectId, userId: currentOwner.id } },
        update: { role: "EDITOR" },
        create: { projectId, userId: currentOwner.id, role: "EDITOR" },
      });

      await tx.projectMember.delete({
        where: { projectId_userId: { projectId, userId: targetUserId } },
      });
    });

    return {
      success: true,
      data: { projectId, ownerId: targetUserId },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
