import { db } from "../../db";
import type { ActionResult } from "../types";

export async function getUpdateById(updateId: string): Promise<
  ActionResult<{ id: string; title: string; bodyMd: string; status: string; tags: string[]; projectId: string }>
> {
  try {
    const update = await db.update.findUnique({
      where: { id: updateId },
      select: { id: true, title: true, bodyMd: true, status: true, tags: true, projectId: true },
    });
    if (!update) return { success: false, error: { code: "NOT_FOUND", message: "Update not found." } };
    return { success: true, data: update };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
