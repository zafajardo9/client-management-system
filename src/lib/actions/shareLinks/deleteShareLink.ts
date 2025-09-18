import type { ActionResult } from "../types";
import { db } from "../../db";

export async function deleteShareLink(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const deleted = await db.shareLink.delete({ where: { id }, select: { id: true } });
    return { success: true, data: { id: deleted.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
