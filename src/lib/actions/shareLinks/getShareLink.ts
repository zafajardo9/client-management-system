import type { ActionResult } from "../types";
import { db } from "../../db";

export async function getShareLink(
  projectId: string
): Promise<
  ActionResult<{
    id: string;
    projectId: string;
    token: string;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null>
> {
  try {
    const link = await db.shareLink.findFirst({
      where: { projectId },
      select: { id: true, projectId: true, token: true, enabled: true, createdAt: true, updatedAt: true },
    });
    return { success: true, data: link ?? null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
