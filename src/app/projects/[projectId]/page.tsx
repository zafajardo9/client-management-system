import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppPageLayout } from "@/components/shared";
import { projects } from "@/lib/actions";

import {
  ProjectSidebarNav,
  type ProjectSection,
  ProjectUpdatesSection,
  ProjectShareLinksSection,
  ProjectCollaboratorsSection,
  UpdatesSectionFallback,
  ShareLinksSectionFallback,
  CollaboratorsSectionFallback,
} from "./components";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ section?: string }>;
}

const sections: ProjectSection[] = [
  {
    value: "updates",
    label: "Updates",
    description: "Post and review progress updates",
  },
  {
    value: "share-links",
    label: "Shareable links",
    description: "Manage public access links",
  },
  {
    value: "collaborators",
    label: "Collaborators",
    description: "Manage project members",
  },
];

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { projectId } = await params;
  const { section } = await searchParams;
  const activeSection = section ?? "updates";

  if (!sections.some((item) => item.value === activeSection)) {
    redirect(`/projects/${projectId}`);
  }

  const projectRes = await projects.getProjectById(projectId);

  if (!projectRes.success) {
    return (
      <AppPageLayout
        title="Project"
        description="We couldn't load this project right now."
        contentClassName=""
      >
        <div className="text-sm text-destructive">{projectRes.error.message}</div>
      </AppPageLayout>
    );
  }

  const project = projectRes.data;

  let sectionContent: ReactNode;
  let fallback: ReactNode;

  switch (activeSection) {
    case "share-links":
      sectionContent = <ProjectShareLinksSection projectId={project.id} />;
      fallback = <ShareLinksSectionFallback />;
      break;
    case "collaborators":
      sectionContent = <ProjectCollaboratorsSection projectId={project.id} />;
      fallback = <CollaboratorsSectionFallback />;
      break;
    case "updates":
    default:
      sectionContent = <ProjectUpdatesSection projectId={project.id} />;
      fallback = <UpdatesSectionFallback />;
      break;
  }

  return (
    <AppPageLayout
      headingSlot={
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
            {project.description ? (
              <p className="text-sm text-muted-foreground">{project.description}</p>
            ) : null}
          </div>
        </div>
      }
      contentClassName="gap-10"
    >
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:self-start">
          <ProjectSidebarNav projectId={project.id} items={sections} activeValue={activeSection} />
        </aside>

        <div className="space-y-6">
          <Suspense key={activeSection} fallback={fallback}>
            {sectionContent}
          </Suspense>
        </div>
      </div>
    </AppPageLayout>
  );
}
