import { members } from "@/lib/actions";

import { MembersSection } from "@/components/pages/projects";

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

  return <MembersSection members={membersRes.data} />;
}
