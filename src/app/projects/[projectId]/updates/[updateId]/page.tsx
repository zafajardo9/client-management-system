import Link from "next/link";
import { projects, updates } from "@/lib/actions";
import { UpdateForm } from "./components";

export default async function UpdateDetailPage({
  params,
}: {
  params: { projectId: string; updateId: string };
}) {
  const [projectRes, updateRes] = await Promise.all([
    projects.getProjectById(params.projectId),
    updates.getUpdateById(params.updateId),
  ]);

  if (!projectRes.success) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-red-600 text-sm">{projectRes.error.message}</div>
      </main>
    );
  }

  if (!updateRes.success) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-red-600 text-sm">{updateRes.error.message}</div>
      </main>
    );
  }

  const project = projectRes.data;
  const update = updateRes.data;

  // Guard: ensure the update belongs to the given projectId
  if (update.projectId !== project.id) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-red-600 text-sm">Update not found for this project.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <header className="space-y-1">
        <Link href={`/projects/${project.id}`} className="text-sm text-muted-foreground hover:underline">
          ← Back to {project.name}
        </Link>
        <h1 className="text-2xl font-semibold">Edit Update</h1>
      </header>

      <section className="rounded-md border p-4">
        <UpdateForm update={update} projectId={project.id} />
      </section>
    </main>
  );
}
