import { projects, updates } from "@/lib/actions";
import { NewUpdateForm, UpdatesList } from "./components";

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  const [projectRes, updatesRes] = await Promise.all([
    projects.getProjectById(params.projectId),
    updates.getUpdates(params.projectId, { page: 1, pageSize: 50 }),
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
        <UpdatesList items={items} />
      </section>
    </main>
  );
}
