import type { ActionResult } from "../types";
import type { Prisma } from "@prisma/client";
import { db } from "../../db";

export async function getPublicUpdatesBySlug(
  slug: string
): Promise<
  ActionResult<{
    link: { id: string; projectId: string; slug: string; visibility: "ALL" | "PUBLISHED_ONLY"; tagFilter: string[] };
    items: Array<{ id: string; title: string; createdAt: Date; status: string; tags: string[] }>;
  }>
> {
  try {
    const link = await db.shareLink.findUnique({
      where: { slug },
      select: { id: true, projectId: true, slug: true, enabled: true, visibility: true, tagFilter: true },
    });
    if (!link || !link.enabled) {
      return { success: false, error: { code: "NOT_FOUND", message: "Share link not found or disabled." } };
    }

    const where: Prisma.UpdateWhereInput = { projectId: link.projectId };
    if (link.visibility === "PUBLISHED_ONLY") {
      where.status = { equals: "PUBLISHED" };
    }
    if (link.tagFilter && link.tagFilter.length) {
      where.AND = [{ tags: { hasEvery: link.tagFilter } }];
    }

    const items = await db.update.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true, status: true, tags: true },
    });

    return {
      success: true,
      data: {
        link: { id: link.id, projectId: link.projectId, slug: link.slug, visibility: link.visibility, tagFilter: link.tagFilter },
        items,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
