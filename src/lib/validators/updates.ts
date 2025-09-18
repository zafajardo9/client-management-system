import { z } from "zod";

export const createUpdateSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1),
  bodyMd: z.string().min(1),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export const updateUpdateSchema = z.object({
  updateId: z.string().min(1),
  title: z.string().min(1).optional(),
  bodyMd: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export type CreateUpdateInput = z.infer<typeof createUpdateSchema>;
export type UpdateUpdateInput = z.infer<typeof updateUpdateSchema>;
