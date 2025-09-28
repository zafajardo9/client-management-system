import { z } from "zod";

export const changelogLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url().or(z.string().startsWith("/")),
});

export const changelogEntrySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(["shipped", "in-progress", "planned"]),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  links: z.array(changelogLinkSchema).optional(),
});

export const changelogQuarterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  entries: z.array(changelogEntrySchema),
});

export const changelogDataSchema = z.object({
  quarters: z.array(changelogQuarterSchema),
});

export type ChangelogLink = z.infer<typeof changelogLinkSchema>;
export type ChangelogEntry = z.infer<typeof changelogEntrySchema>;
export type ChangelogQuarter = z.infer<typeof changelogQuarterSchema>;
export type ChangelogData = z.infer<typeof changelogDataSchema>;
