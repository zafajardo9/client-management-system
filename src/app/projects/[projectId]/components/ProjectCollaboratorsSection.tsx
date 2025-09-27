import { Suspense } from "react";

import { members } from "@/lib/actions";

import { MembersSection } from "@/components/pages/projects";

import CollaboratorsManager from "./CollaboratorsManager";

interface ProjectCollaboratorsSectionProps {
  projectId: string;
}

export default async function ProjectCollaboratorsSection({
  projectId,
}: ProjectCollaboratorsSectionProps) {
  const membersRes = await members.getMembers(projectId);

  if (!membersRes.success) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {membersRes.error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MembersSection members={membersRes.data.members} viewer={membersRes.data.viewer} />
      {membersRes.data.viewer.canManage ? (
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading collaborator tools…</div>}>
          <CollaboratorsManager projectId={projectId} />
        </Suspense>
      ) : null}
    </div>
  );
}
