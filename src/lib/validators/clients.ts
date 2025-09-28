import { z } from "zod";

export const clientRoleEnum = z.enum(["CLIENT", "INTERNAL"]);
export const clientStatusEnum = z.enum(["PENDING", "ACTIVE", "INACTIVE", "REVOKED"]);

export const createClientSchema = z.object({
  projectId: z.string().min(1),
  email: z.string().email(),
  name: z.string().trim().min(1).max(120).optional(),
  tags: z.array(z.string().trim().min(1)).max(8).optional(),
});

export const updateClientAccessSchema = z.object({
  projectId: z.string().min(1),
  clientAccessId: z.string().min(1),
  status: clientStatusEnum.optional(),
  tags: z.array(z.string().trim().min(1)).max(8).optional(),
});

export const removeClientAccessSchema = z.object({
  projectId: z.string().min(1),
  clientAccessId: z.string().min(1),
});

export const searchClientCandidatesSchema = z.object({
  projectId: z.string().min(1),
  query: z.string().trim().min(1).max(100),
  limit: z.number().min(1).max(20).default(5),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientAccessInput = z.infer<typeof updateClientAccessSchema>;
export type RemoveClientAccessInput = z.infer<typeof removeClientAccessSchema>;
export type SearchClientCandidatesInput = z.infer<typeof searchClientCandidatesSchema>;
