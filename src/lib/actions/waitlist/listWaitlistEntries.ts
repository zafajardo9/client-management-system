import type { Prisma, WaitlistStatus } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

import { db } from "../../db";
import { listWaitlistEntriesSchema } from "../../validators";
import type { ActionResult } from "../types";

interface WaitlistEntryWithPreview {
  id: string;
  email: string;
  fullName: string | null;
  company: string | null;
  goals: string | null;
  source: string | null;
  notes: string | null;
  status: WaitlistStatus;
  convertedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  latestEvent?: {
    id: string;
    type: string;
    notes: string | null;
    createdAt: Date;
  } | null;
}

export async function listWaitlistEntries(
  input: unknown = {}
): Promise<ActionResult<{ entries: WaitlistEntryWithPreview[] }>> {
  const parseResult = listWaitlistEntriesSchema.safeParse(input ?? {});

  if (!parseResult.success) {
    return {
      success: false,
      error: {
        code: "INVALID_INPUT",
        message: "Invalid waitlist query parameters.",
        details: parseResult.error.flatten(),
      },
    };
  }

  const { status, search, limit } = parseResult.data;

  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in." },
      };
    }

    const where: Prisma.WaitlistEntryWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search && search.length > 0) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ];
    }

    const entries = await db.waitlistEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        events: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, type: true, notes: true, createdAt: true },
        },
      },
    });

    const normalized: WaitlistEntryWithPreview[] = entries.map((entry) => ({
      id: entry.id,
      email: entry.email,
      fullName: entry.fullName,
      company: entry.company,
      goals: entry.goals,
      source: entry.source,
      notes: entry.notes,
      status: entry.status,
      convertedAt: entry.convertedAt,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      latestEvent: entry.events[0]
        ? {
            id: entry.events[0].id,
            type: entry.events[0].type,
            notes: entry.events[0].notes,
            createdAt: entry.events[0].createdAt,
          }
        : null,
    }));

    return { success: true, data: { entries: normalized } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
