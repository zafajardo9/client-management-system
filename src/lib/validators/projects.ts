import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().max(2000).optional(),
});

export const updateProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  description: z.string().max(2000).nullable().optional(),
  isArchived: z.boolean().optional(),
});

export const transferOwnershipSchema = z.object({
  projectId: z.string().min(1),
  targetUserId: z.string().min(1),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type TransferOwnershipInput = z.infer<typeof transferOwnershipSchema>;
