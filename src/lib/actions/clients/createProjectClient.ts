import { randomUUID } from "crypto";

import { auth } from "@clerk/nextjs/server";
import { ClientRole, ClientStatus, type PrismaClient } from "@prisma/client";

import { db } from "../../db";
import type { ActionResult } from "../types";
import { createClientSchema, type CreateClientInput } from "@/lib/validators";
import { clientAccessSelect, mapClientAccess } from "./shared";
import { ensureProjectTags } from "./tagHelpers";
import type { ProjectClient } from "./types";

const prisma = db as PrismaClient;

export async function createProjectClient(input: CreateClientInput): Promise<ActionResult<ProjectClient>> {
  try {
    const parsed = createClientSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: { code: "INVALID_INPUT", message: "Invalid client payload.", details: parsed.error.flatten() },
      };
    }

    const { projectId, email, name, tags = [] } = parsed.data;
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const me = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } });
    if (!me) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, ownerId: true },
    });

    if (!project) {
      return { success: false, error: { code: "NOT_FOUND", message: "Project not found." } };
    }

    if (project.ownerId !== me.id) {
      return { success: false, error: { code: "FORBIDDEN", message: "Only the project owner can manage clients." } };
    }

    const normalizedEmail = email.trim().toLowerCase();

    let contact = await prisma.clientContact.findFirst({
      where: { ownerId: me.id, email: normalizedEmail },
      select: { id: true },
    });

    if (!contact) {
      contact = await prisma.clientContact.create({
        data: {
          ownerId: me.id,
          email: normalizedEmail,
          name: name?.trim() ?? null,
        },
        select: { id: true },
      });
    }

    const existingAccess = await prisma.clientProjectAccess.findUnique({
      where: { projectId_clientId: { projectId, clientId: contact.id } },
      select: { id: true },
    });

    if (existingAccess) {
      return {
        success: false,
        error: { code: "CONFLICT", message: "Client already added to this project." },
      };
    }

    const tagRecords = await ensureProjectTags(prisma, projectId, tags);

    const inviteToken = randomUUID();

    const access = await prisma.clientProjectAccess.create({
      data: {
        projectId,
        clientId: contact.id,
        invitedById: me.id,
        role: ClientRole.CLIENT,
        status: ClientStatus.PENDING,
        inviteToken,
        tags: tagRecords.length
          ? {
              create: tagRecords.map((tag) => ({ tag: { connect: { id: tag.id } } })),
            }
          : undefined,
      },
      select: clientAccessSelect,
    });

    return { success: true, data: mapClientAccess(access) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
