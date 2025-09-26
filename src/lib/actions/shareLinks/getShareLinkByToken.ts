import type { ActionResult } from "../types";
import { db } from "../../db";

export async function getShareLinkByToken(
  token: string
): Promise<ActionResult<{ id: string; projectId: string; token: string; enabled: boolean }>> {
  try {
    const link = await db.shareLink.findUnique({
      where: { token },
      select: { id: true, projectId: true, token: true, enabled: true },
    });

    if (!link || !link.enabled) {
      return { success: false, error: { code: "NOT_FOUND", message: "Share link not found or disabled." } };
    }

    return { success: true, data: link };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
