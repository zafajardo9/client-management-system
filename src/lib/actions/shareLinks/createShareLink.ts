import type { ActionResult } from "../types";
import { db } from "../../db";

export async function createShareLink(
  projectId: string,
  opts: { slug: string; passwordHash?: string; visibility?: "ALL" | "PUBLISHED_ONLY"; tagFilter?: string[] }
): Promise<ActionResult<{ id: string }>> {
  try {
    const link = await db.shareLink.create({
      data: {
        projectId,
        slug: opts.slug,
        passwordHash: opts.passwordHash,
        visibility: (opts.visibility ?? "ALL") as "ALL" | "PUBLISHED_ONLY",
        tagFilter: opts.tagFilter ?? [],
      },
      select: { id: true },
    });
    return { success: true, data: { id: link.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
