import { auth } from "@clerk/nextjs/server";
import type { PrismaClient } from "@prisma/client";

import { db } from "../../db";
import type { ActionResult } from "../types";
import { searchClientCandidatesSchema, type SearchClientCandidatesInput } from "@/lib/validators";
import type { ClientCandidate } from "./types";

const prisma = db as PrismaClient;

export async function searchClientCandidates(
  input: SearchClientCandidatesInput
): Promise<ActionResult<{ candidates: ClientCandidate[] }>> {
  try {
    const parsed = searchClientCandidatesSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: { code: "INVALID_INPUT", message: "Invalid search payload.", details: parsed.error.flatten() },
      };
    }

    const { projectId, query, limit } = parsed.data;

    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const me = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } });
    if (!me) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
    if (!project || project.ownerId !== me.id) {
      return {
        success: false,
        error: { code: "FORBIDDEN", message: "Only the project owner can search client contacts." },
      };
    }

    const normalizedQuery = query.trim().toLowerCase();

    const contacts = await prisma.clientContact.findMany({
      where: {
        ownerId: me.id,
        OR: [
          { email: { contains: normalizedQuery, mode: "insensitive" } },
          { name: { contains: normalizedQuery, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        access: {
          where: { projectId },
          select: { id: true },
        },
      },
      take: limit,
      orderBy: [{ name: "asc" }, { email: "asc" }],
    });

    const candidates: ClientCandidate[] = contacts.map((contact) => ({
      clientId: contact.id,
      email: contact.email,
      name: contact.name ?? null,
      alreadyAssigned: contact.access.length > 0,
    }));

    return { success: true, data: { candidates } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
