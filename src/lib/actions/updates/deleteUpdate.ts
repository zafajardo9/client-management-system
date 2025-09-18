import type { ActionResult } from "../types";
import { db } from "../../db";

export async function deleteUpdate(updateId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const deleted = await db.update.delete({ where: { id: updateId }, select: { id: true } });
    return { success: true, data: { id: deleted.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
