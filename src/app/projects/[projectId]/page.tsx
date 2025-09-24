import { projects, updates, shareLinks, members } from "@/lib/actions";
import {
  NewUpdateForm,
  UpdatesList,
  ShareLinksSection,
  MembersSection,
} from "@/components/pages/projects";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  const [projectRes, updatesRes, linksRes, membersRes] = await Promise.all([
    projects.getProjectById(projectId),
    updates.getUpdates(projectId, { page: 1, pageSize: 50 }),
    shareLinks.getShareLinks(projectId),
    members.getMembers(projectId),
  ]);

  if (!projectRes.success) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-red-600 text-sm">{projectRes.error.message}</div>
      </main>
    );
  }

  const project = projectRes.data;
  const items = updatesRes.success ? updatesRes.data.items : [];
  const links = linksRes.success ? linksRes.data : [];
  const memberList = membersRes.success ? membersRes.data : [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        {project.description && (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        )}
      </header>

      <section className="rounded-md border p-4">
        <h2 className="font-medium mb-3">Post Update</h2>
        <NewUpdateForm projectId={project.id} />
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Updates</h2>
        <UpdatesList projectId={project.id} items={items} />
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Share Links</h2>
        <ShareLinksSection projectId={project.id} links={links} />
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Collaborators</h2>
        <MembersSection members={memberList} />
      </section>
    </main>
  );
}
