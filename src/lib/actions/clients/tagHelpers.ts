import type { PrismaClient } from "@prisma/client";

export async function ensureProjectTags(
  prisma: PrismaClient,
  projectId: string,
  labels: string[]
): Promise<Array<{ id: string; label: string; color: string | null }>> {
  if (labels.length === 0) {
    return [];
  }

  const uniqueLabels = Array.from(new Set(labels.map((label) => label.trim()).filter(Boolean)));
  if (uniqueLabels.length === 0) {
    return [];
  }

  const existing = await prisma.clientTag.findMany({
    where: { projectId, label: { in: uniqueLabels } },
    select: { id: true, label: true, color: true },
  });

  const existingMap = new Map(existing.map((tag) => [tag.label, tag] as const));

  const missing = uniqueLabels.filter((label) => !existingMap.has(label));
  if (missing.length) {
    await prisma.clientTag.createMany({
      data: missing.map((label) => ({ projectId, label })),
      skipDuplicates: true,
    });

    const created = await prisma.clientTag.findMany({
      where: { projectId, label: { in: missing } },
      select: { id: true, label: true, color: true },
    });

    for (const tag of created) {
      existingMap.set(tag.label, tag);
    }
  }

  return uniqueLabels
    .map((label) => existingMap.get(label))
    .filter((tag): tag is { id: string; label: string; color: string | null } => Boolean(tag));
}
