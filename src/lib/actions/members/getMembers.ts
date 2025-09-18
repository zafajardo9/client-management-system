import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import type { ActionResult } from "../types";

export type MemberListItem = {
  userId: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
  user: { id: string; name: string | null; email: string };
};

export async function getMembers(projectId: string): Promise<ActionResult<MemberListItem[]>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const me = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!me) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true, ownerId: true, members: { select: { userId: true } } },
    });
    if (!project) {
      return { success: false, error: { code: "NOT_FOUND", message: "Project not found." } };
    }

    const isOwner = project.ownerId === me.id;
    const isMember = project.members.some((m) => m.userId === me.id);
    if (!isOwner && !isMember) {
      return { success: false, error: { code: "FORBIDDEN", message: "You do not have access to view members." } };
    }

    // Owner is implicit member with OWNER role; union with explicit members
    const members = await db.projectMember.findMany({
      where: { projectId },
      select: {
        userId: true,
        role: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Add owner as first item
    const ownerUser = await db.user.findUnique({ where: { id: project.ownerId }, select: { id: true, name: true, email: true } });
    const list: MemberListItem[] = [
      { userId: project.ownerId, role: "OWNER", user: { id: ownerUser?.id ?? project.ownerId, name: ownerUser?.name ?? null, email: ownerUser?.email ?? "" } },
      ...members.map((m) => ({ userId: m.userId, role: m.role as MemberListItem["role"], user: { id: m.user.id, name: m.user.name, email: m.user.email } })),
    ];

    return { success: true, data: list };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
