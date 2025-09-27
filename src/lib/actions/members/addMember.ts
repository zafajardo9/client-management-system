import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import type { PrismaClient } from "@prisma/client";

import { db } from "../../db";
import type { ActionResult } from "../types";
import { addMemberSchema } from "../../validators";

const prisma = db as PrismaClient;

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

    const { projectId, userId, email, role } = parsed.data;
    const normalizedEmail = email?.trim().toLowerCase();
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const me = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!me) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return { success: false, error: { code: "NOT_FOUND", message: "Project not found." } };
    }

    if (project.ownerId !== me.id) {
      return { success: false, error: { code: "FORBIDDEN", message: "Only the owner can manage members." } };
    }

    const targetUser = userId
      ? await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
      : await prisma.user.findUnique({ where: { email: normalizedEmail! }, select: { id: true } });

    if (!targetUser) {
      return { success: false, error: { code: "NOT_FOUND", message: "Target user not found." } };
    }

    if (targetUser.id === project.ownerId) {
      return {
        success: false,
        error: { code: "INVALID_TARGET", message: "Project owner already has full access." },
      };
    }

    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUser.id } },
    });

    let member;
    if (existing) {
      member = await prisma.projectMember.update({
        where: { projectId_userId: { projectId, userId: targetUser.id } },
        data: { role },
        select: { id: true, projectId: true, userId: true, role: true },
      });
    } else {
      member = await prisma.projectMember.create({
        data: { projectId, userId: targetUser.id, role },
        select: { id: true, projectId: true, userId: true, role: true },
      });
    }

    return { success: true, data: member };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
