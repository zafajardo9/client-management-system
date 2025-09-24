import Link from "next/link";

import { PageHeader, ProjectCreateCard, ProjectList, ProjectRowActions } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/lib/actions";

export default async function ProjectsPage() {
  const result = await projects.getProjects();

  if (!result.success) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <PageHeader title="Projects" subtitle="We couldn't load your projects right now." />
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{result.error.message}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const activeProjects = result.data.filter((project) => !project.isArchived);
  const archivedProjects = result.data.filter((project) => project.isArchived);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <PageHeader
        title="Projects"
        subtitle="Create, organize, and share updates for every engagement you manage."
        actions={
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <ProjectCreateCard />

        <div className="space-y-6">
          <ProjectList
            projects={activeProjects}
            title="Active projects"
            description="Everything currently in progress or shared with collaborators."
            emptyTitle="No active projects"
            emptyDescription="Create a project or unarchive an existing one to see it here."
            renderActions={(project) => (
              <ProjectRowActions projectId={project.id} isArchived={project.isArchived} />
            )}
          />

          <ProjectList
            projects={archivedProjects}
            title="Archived projects"
            description="These projects are archived and read-only."
            emptyTitle="No archived projects"
            emptyDescription="Archiving projects keeps your dashboard focused while still retaining history."
            renderActions={(project) => (
              <ProjectRowActions projectId={project.id} isArchived={project.isArchived} />
            )}
          />
        </div>
      </div>
    </main>
  );
}
