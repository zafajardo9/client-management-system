import type { ClientRole, ClientStatus } from "@prisma/client";

export type ProjectClientTag = {
  id: string;
  label: string;
  color: string | null;
};

export type ProjectClient = {
  accessId: string;
  projectId: string;
  clientId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: ClientRole;
  status: ClientStatus;
  inviteToken: string | null;
  invitedBy: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  tags: ProjectClientTag[];
  lastViewedAt: Date | null;
  createdAt: Date;
};

export type ProjectClientsViewer = {
  canManage: boolean;
};

export type GetProjectClientsPayload = {
  clients: ProjectClient[];
  availableTags: ProjectClientTag[];
  viewer: ProjectClientsViewer;
};

export type ClientCandidate = {
  clientId: string;
  email: string;
  name: string | null;
  alreadyAssigned: boolean;
};
