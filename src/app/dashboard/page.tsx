import Link from "next/link";
import { projects } from "@/lib/actions";
import { CreateProjectForm } from "./components";

export default async function DashboardPage() {
  const result = await projects.getProjects();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your projects and updates.</p>
      </header>

      <section className="rounded-md border p-4">
        <h2 className="font-medium mb-3">Create Project</h2>
        {/* Client component posting to /api/projects */}
        <CreateProjectForm />
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Your Projects</h2>
        {result.success ? (
          <ul className="divide-y rounded-md border">
            {result.data.length === 0 && (
              <li className="p-4 text-sm text-muted-foreground">No projects yet. Create one above.</li>
            )}
            {result.data.map((p) => (
              <li key={p.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  {p.description && <div className="text-sm text-muted-foreground">{p.description}</div>}
                </div>
                <Link href={`/projects/${p.id}`} className="text-primary hover:underline">
                  Open →
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-red-600">{result.error.message}</div>
        )}
      </section>
    </main>
  );
}
