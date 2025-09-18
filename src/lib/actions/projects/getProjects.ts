import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import type { ActionResult } from "../types";

export async function getProjects(): Promise<
  ActionResult<
    Array<{ id: string; name: string; description: string | null; isArchived: boolean }>
  >
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

    const projects = await db.project.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, description: true, isArchived: true },
    });

    return { success: true, data: projects };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
