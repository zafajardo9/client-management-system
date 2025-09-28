import { auth } from "@clerk/nextjs/server";
import type { PrismaClient } from "@prisma/client";

import { db } from "../../db";
import type { ActionResult } from "../types";
import { updateClientAccessSchema, type UpdateClientAccessInput } from "@/lib/validators";
import { clientAccessSelect, mapClientAccess } from "./shared";
import { ensureProjectTags } from "./tagHelpers";
import type { ProjectClient } from "./types";

const prisma = db as PrismaClient;

export async function updateClientAccess(input: UpdateClientAccessInput): Promise<ActionResult<ProjectClient>> {
  try {
    const parsed = updateClientAccessSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: { code: "INVALID_INPUT", message: "Invalid client update payload.", details: parsed.error.flatten() },
      };
    }

    const { projectId, clientAccessId, status, tags = [] } = parsed.data;

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

    const tagRecords = await ensureProjectTags(prisma, projectId, tags);

    const updated = await prisma.clientProjectAccess.update({
      where: { id: clientAccessId },
      data: {
        status: status ?? undefined,
        tags: {
          deleteMany: {},
          ...(tagRecords.length
            ? {
                create: tagRecords.map((tag) => ({ tag: { connect: { id: tag.id } } })),
              }
            : {}),
        },
      },
      select: clientAccessSelect,
    });

    return { success: true, data: mapClientAccess(updated) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
