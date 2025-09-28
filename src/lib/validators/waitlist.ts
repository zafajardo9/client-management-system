import { z } from "zod";

export const waitlistStatusEnum = z.enum(["PENDING", "ENGAGED", "CONVERTED", "OPTED_OUT"]);

export const createWaitlistEntrySchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  fullName: z.string().trim().min(1, "Full name is required").max(200).optional(),
  company: z.string().trim().max(200).optional(),
  goals: z.string().trim().max(2000).optional(),
  source: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const listWaitlistEntriesSchema = z.object({
  status: waitlistStatusEnum.optional(),
  search: z.string().trim().max(200).optional(),
  limit: z.number().int().min(1).max(100).default(50),
});

export const updateWaitlistStatusSchema = z.object({
  id: z.string().min(1),
  status: waitlistStatusEnum,
  notes: z.string().trim().max(2000).optional(),
});

export type CreateWaitlistEntryInput = z.infer<typeof createWaitlistEntrySchema>;
export type ListWaitlistEntriesInput = z.infer<typeof listWaitlistEntriesSchema>;
export type UpdateWaitlistStatusInput = z.infer<typeof updateWaitlistStatusSchema>;
