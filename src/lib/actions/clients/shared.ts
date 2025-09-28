import type { Prisma } from "@prisma/client";

import type { ProjectClient } from "./types";

export const clientAccessSelect = {
  id: true,
  projectId: true,
  clientId: true,
  role: true,
  status: true,
  inviteToken: true,
  lastViewedAt: true,
  createdAt: true,
  client: {
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
    },
  },
  invitedBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          label: true,
          color: true,
        },
      },
    },
  },
} satisfies Prisma.ClientProjectAccessSelect;

export type ClientAccessWithRelations = Prisma.ClientProjectAccessGetPayload<{
  select: typeof clientAccessSelect;
}>;

export function mapClientAccess(access: ClientAccessWithRelations): ProjectClient {
  return {
    accessId: access.id,
    projectId: access.projectId,
    clientId: access.clientId,
    email: access.client.email,
    name: access.client.name ?? null,
    avatarUrl: access.client.avatarUrl ?? null,
    role: access.role,
    status: access.status,
    inviteToken: access.inviteToken ?? null,
    invitedBy: access.invitedBy
      ? {
          id: access.invitedBy.id,
          name: access.invitedBy.name ?? null,
          email: access.invitedBy.email,
        }
      : null,
    tags: access.tags.flatMap(({ tag }): Array<{ id: string; label: string; color: string | null }> =>
      tag ? [{ id: tag.id, label: tag.label, color: tag.color ?? null }] : []
    ),
    lastViewedAt: access.lastViewedAt ?? null,
    createdAt: access.createdAt,
  };
}
