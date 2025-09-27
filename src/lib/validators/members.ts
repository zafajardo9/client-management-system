import { z } from "zod";

export const addMemberSchema = z
  .object({
    projectId: z.string().min(1),
    userId: z.string().min(1).optional(),
    email: z.string().email().optional(),
    role: z.enum(["EDITOR", "VIEWER"]),
  })
  .refine((data) => Boolean(data.userId) || Boolean(data.email), {
    message: "A user identifier (id or email) is required.",
    path: ["email"],
  });

export const removeMemberSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
});

export const updateMemberSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(["EDITOR", "VIEWER"]),
});

export const searchCollaboratorCandidatesSchema = z.object({
  projectId: z.string().min(1),
  query: z.string().trim().min(1).max(100),
  limit: z.number().min(1).max(20).default(5),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type SearchCollaboratorCandidatesInput = z.infer<typeof searchCollaboratorCandidatesSchema>;
