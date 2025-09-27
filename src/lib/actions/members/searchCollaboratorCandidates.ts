import { auth } from "@clerk/nextjs/server";
import type { PrismaClient } from "@prisma/client";

import { db } from "../../db";
import type { ActionResult } from "../types";
import { searchCollaboratorCandidatesSchema } from "../../validators";

const prisma = db as PrismaClient;

export type CollaboratorCandidate = {
  id: string;
  email: string;
  name: string | null;
};

export async function searchCollaboratorCandidates(
  input: unknown
): Promise<ActionResult<CollaboratorCandidate[]>> {
  try {
    const parsed = searchCollaboratorCandidatesSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid input.", details: parsed.error.flatten() },
      };
    }

    const { projectId, query, limit } = parsed.data;
    const normalizedQuery = query.trim();

    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const me = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!me) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        ownerId: true,
        members: { select: { userId: true } },
      },
    });

    if (!project) {
      return { success: false, error: { code: "NOT_FOUND", message: "Project not found." } };
    }

    if (project.ownerId !== me.id) {
      return { success: false, error: { code: "FORBIDDEN", message: "Only the owner can invite collaborators." } };
    }

    const excludedUserIds = new Set<string>([project.ownerId, ...project.members.map((member) => member.userId)]);

    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(excludedUserIds) },
        OR: [
          { email: { contains: normalizedQuery, mode: "insensitive" } },
          { name: { contains: normalizedQuery, mode: "insensitive" } },
        ],
      },
      orderBy: { email: "asc" },
      take: limit,
      select: { id: true, email: true, name: true },
    });

    return { success: true, data: candidates };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
