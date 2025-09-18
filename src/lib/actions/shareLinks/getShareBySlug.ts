import type { ActionResult } from "../types";
import { db } from "../../db";

export async function getShareBySlug(
  slug: string
): Promise<
  ActionResult<{
    id: string;
    projectId: string;
    slug: string;
    enabled: boolean;
    visibility: "ALL" | "PUBLISHED_ONLY";
    tagFilter: string[];
  }>
> {
  try {
    const link = await db.shareLink.findUnique({
      where: { slug },
      select: {
        id: true,
        projectId: true,
        slug: true,
        enabled: true,
        visibility: true,
        tagFilter: true,
      },
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
