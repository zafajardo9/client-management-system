import type { ActionResult } from "../types";
import { db } from "../../db";

export async function updateShareLink(
  id: string,
  data: { enabled?: boolean; passwordHash?: string | null; visibility?: "ALL" | "PUBLISHED_ONLY"; tagFilter?: string[] }
): Promise<ActionResult<{ id: string }>> {
  try {
    const updated = await db.shareLink.update({
      where: { id },
      data: {
        enabled: data.enabled ?? undefined,
        passwordHash: data.passwordHash === undefined ? undefined : data.passwordHash,
        visibility: (data.visibility as "ALL" | "PUBLISHED_ONLY") ?? undefined,
        tagFilter: data.tagFilter ?? undefined,
      },
      select: { id: true },
    });
    return { success: true, data: { id: updated.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
