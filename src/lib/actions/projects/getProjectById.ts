import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import type { ActionResult } from "../types";

export async function getProjectById(
  projectId: string
): Promise<
  ActionResult<{ id: string; name: string; description: string | null; isArchived: boolean }>
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in." },
      };
    }

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return {
        success: false,
        error: { code: "USER_NOT_FOUND", message: "User profile not found." },
      };
    }

    const project = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } },
        ],
      },
      select: { id: true, name: true, description: true, isArchived: true },
    });

    if (!project) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found or not accessible." },
      };
    }

    return { success: true, data: project };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
