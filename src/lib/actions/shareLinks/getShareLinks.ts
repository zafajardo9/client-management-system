import type { ActionResult } from "../types";
import { db } from "../../db";

export async function getShareLinks(projectId: string): Promise<
  ActionResult<Array<{ id: string; slug: string; enabled: boolean; createdAt: Date }>>
> {
  try {
    const links = await db.shareLink.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      select: { id: true, slug: true, enabled: true, createdAt: true },
    });
    return { success: true, data: links };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
