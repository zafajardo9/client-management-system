import { z } from "zod";

export const addMemberSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(["EDITOR", "VIEWER"]),
});

export const removeMemberSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;
