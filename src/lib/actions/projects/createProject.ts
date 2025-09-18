import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import { createProjectSchema } from "../../validators";
import type { ActionResult } from "../types";
import { ensureUser } from "../../auth/ensureUser";

export async function createProject(
  input: z.infer<typeof createProjectSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in." },
      };
    }

    const user = await ensureUser();
    if (!user) {
      return {
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message:
            "User profile not found. Ensure user is synced on first sign-in.",
        },
      };
    }

    const project = await db.project.create({
      data: {
        name: input.name,
        description: input.description,
        ownerId: user.id,
      },
      select: { id: true },
    });

    return { success: true, data: { id: project.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
