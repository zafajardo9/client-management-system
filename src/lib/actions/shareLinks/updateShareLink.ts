import type { ActionResult } from "../types";
import { db } from "../../db";
import { generateShareToken } from "./utils";

export async function updateShareLink(
  id: string,
  data: { enabled?: boolean; regenerateToken?: boolean }
): Promise<ActionResult<{ id: string; projectId: string; token: string; enabled: boolean; updatedAt: Date }>> {
  try {
    const nextToken = data.regenerateToken ? generateShareToken() : undefined;

    const updated = await db.shareLink.update({
      where: { id },
      data: {
        enabled: data.enabled ?? undefined,
        token: nextToken,
      },
      select: { id: true, projectId: true, token: true, enabled: true, updatedAt: true },
    });

    return { success: true, data: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
