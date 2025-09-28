import { auth } from "@clerk/nextjs/server";
import type { PrismaClient } from "@prisma/client";

import { db } from "../../db";
import type { ActionResult } from "../types";
import type { GetProjectClientsPayload } from "./types";
import { clientAccessSelect, mapClientAccess } from "./shared";

const prisma = db as PrismaClient;

export async function getProjectClients(projectId: string): Promise<ActionResult<GetProjectClientsPayload>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const me = await prisma.user.findUnique({ where: { clerkUserId: userId } });
    if (!me) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: me.id }, { members: { some: { userId: me.id } } }],
      },
      select: { id: true, ownerId: true },
    });

    if (!project) {
      return { success: false, error: { code: "NOT_FOUND", message: "Project not found or not accessible." } };
    }

    const accesses = await prisma.clientProjectAccess.findMany({
      where: { projectId },
      select: clientAccessSelect,
      orderBy: { createdAt: "asc" },
    });

    const tags = await prisma.clientTag.findMany({
      where: { projectId },
      select: { id: true, label: true, color: true },
      orderBy: { label: "asc" },
    });

    return {
      success: true,
      data: {
        clients: accesses.map(mapClientAccess),
        availableTags: tags.map((tag) => ({ id: tag.id, label: tag.label, color: tag.color ?? null })),
        viewer: { canManage: project.ownerId === me.id },
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
