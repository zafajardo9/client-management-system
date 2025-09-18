import { db } from "../../db";
import type { ActionResult } from "../types";

export async function getUpdates(
  projectId: string,
  opts: { status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"; tags?: string[]; page?: number; pageSize?: number } = {}
): Promise<
  ActionResult<{
    items: Array<{ id: string; title: string; createdAt: Date; status: string; tags: string[] }>;
    page: number;
    pageSize: number;
    total: number;
  }>
> {
  try {
    const page = Math.max(1, opts.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));

    const where = {
      projectId,
      status: opts.status ? { equals: opts.status } : undefined,
      AND: opts.tags && opts.tags.length ? [{ tags: { hasEvery: opts.tags } }] : undefined,
    } as const;

    const [total, items] = await Promise.all([
      db.update.count({ where }),
      db.update.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: pageSize,
        skip: (page - 1) * pageSize,
        select: { id: true, title: true, createdAt: true, status: true, tags: true },
      }),
    ]);

    return { success: true, data: { items, page, pageSize, total } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
