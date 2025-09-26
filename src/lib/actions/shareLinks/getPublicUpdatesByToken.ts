import type { ActionResult } from "../types";
import { db } from "../../db";

export async function getPublicUpdatesByToken(
  token: string
): Promise<
  ActionResult<{
    link: { id: string; projectId: string; token: string; createdAt: Date; updatedAt: Date };
    project: { id: string; name: string; description: string | null };
    items: Array<{ id: string; title: string; bodyMd: string; createdAt: Date; tags: string[] }>;
  }>
> {
  try {
    const link = await db.shareLink.findUnique({
      where: { token },
      select: {
        id: true,
        projectId: true,
        token: true,
        enabled: true,
        createdAt: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!link || !link.enabled) {
      return { success: false, error: { code: "NOT_FOUND", message: "Share link not found or disabled." } };
    }

    const items = await db.update.findMany({
      where: { projectId: link.projectId, status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, bodyMd: true, createdAt: true, tags: true },
    });

    return {
      success: true,
      data: {
        link: {
          id: link.id,
          projectId: link.projectId,
          token: link.token,
          createdAt: link.createdAt,
          updatedAt: link.updatedAt,
        },
        project: link.project,
        items,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
