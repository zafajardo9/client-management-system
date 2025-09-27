import { auth } from "@clerk/nextjs/server";
import type { PrismaClient } from "@prisma/client";

import { db } from "../../db";
import type { ActionResult } from "../types";

const prisma = db as PrismaClient;

export type MemberListItem = {
  userId: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
  user: { id: string; name: string | null; email: string };
};

export type GetMembersPayload = {
  members: MemberListItem[];
  viewer: { role: MemberListItem["role"]; canManage: boolean };
};

export async function getMembers(projectId: string): Promise<ActionResult<GetMembersPayload>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "You must be signed in." } };
    }

    const me = await prisma.user.findUnique({ where: { clerkUserId: userId } });
    if (!me) {
      return { success: false, error: { code: "USER_NOT_FOUND", message: "User profile not found." } };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        ownerId: true,
        members: { select: { userId: true, role: true } },
      },
    });
    if (!project) {
      return { success: false, error: { code: "NOT_FOUND", message: "Project not found." } };
    }

    const isOwner = project.ownerId === me.id;
    type ProjectMemberSummary = (typeof project.members)[number];
    const membership = project.members.find((member: ProjectMemberSummary) => member.userId === me.id);
    const isMember = Boolean(membership);
    if (!isOwner && !isMember) {
      return { success: false, error: { code: "FORBIDDEN", message: "You do not have access to view members." } };
    }

    // Owner is implicit member with OWNER role; union with explicit members
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      select: {
        userId: true,
        role: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Add owner as first item
    const ownerUser = await prisma.user.findUnique({ where: { id: project.ownerId }, select: { id: true, name: true, email: true } });
    type ProjectMemberRecord = (typeof members)[number];
    const list: MemberListItem[] = [
      { userId: project.ownerId, role: "OWNER", user: { id: ownerUser?.id ?? project.ownerId, name: ownerUser?.name ?? null, email: ownerUser?.email ?? "" } },
      ...members
        .filter((member: ProjectMemberRecord) => member.userId !== project.ownerId)
        .map((member: ProjectMemberRecord) => ({
          userId: member.userId,
          role: member.role as MemberListItem["role"],
          user: { id: member.user.id, name: member.user.name, email: member.user.email },
        })),
    ];

    const viewerRole: MemberListItem["role"] = isOwner
      ? "OWNER"
      : ((membership?.role as MemberListItem["role"]) ?? "VIEWER");

    return { success: true, data: { members: list, viewer: { role: viewerRole, canManage: isOwner } } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: { code: "INTERNAL", message } };
  }
}
