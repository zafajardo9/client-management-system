import { updates } from "@/lib/actions";

import { NewUpdateForm, UpdatesList } from "@/components/pages/projects";

interface ProjectUpdatesSectionProps {
  projectId: string;
}

export default async function ProjectUpdatesSection({ projectId }: ProjectUpdatesSectionProps) {
  const updatesRes = await updates.getUpdates(projectId, { page: 1, pageSize: 20 });

  if (!updatesRes.success) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {updatesRes.error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NewUpdateForm projectId={projectId} className="border shadow-none" />
      <UpdatesList projectId={projectId} items={updatesRes.data.items} className="border shadow-none" />
    </div>
  );
}
