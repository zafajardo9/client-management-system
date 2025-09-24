import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, ProjectCreateCard, ProjectList, ProjectRowActions } from "@/components/shared";
import { DashboardAnalytics } from "@/components/pages/dashboard";
import { projects } from "@/lib/actions";

export default async function DashboardPage() {
  const result = await projects.getProjects();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <PageHeader
        title="Dashboard"
        subtitle="Create new projects, review existing work, and stay aligned with your team."
      />

      <DashboardAnalytics />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <ProjectCreateCard />

        {result.success ? (
          <ProjectList
            projects={result.data}
            title="Your projects"
            description="Browse every project you own or collaborate on."
            emptyTitle="You haven't created any projects yet"
            emptyDescription="Launch your first project to begin sharing updates with your stakeholders."
            renderActions={(project) => (
              <ProjectRowActions projectId={project.id} isArchived={project.isArchived} />
            )}
          />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Unable to load projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">{result.error.message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
