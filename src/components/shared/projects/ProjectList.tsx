import type { ReactNode } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

export type ProjectListItem = {
  id: string;
  name: string;
  description: string | null;
  isArchived: boolean;
};

interface ProjectListProps {
  projects: ProjectListItem[];
  title?: string;
  description?: string;
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: ReactNode;
  renderActions?: (project: ProjectListItem) => ReactNode;
}

export function ProjectList({
  projects,
  title = "Projects",
  description = "Access your active and archived projects.",
  className,
  emptyTitle = "No projects yet",
  emptyDescription = "Create a project to get started and collaborate with your team.",
  actions,
  renderActions,
}: ProjectListProps) {
  const hasProjects = projects.length > 0;

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className={actions ? "@container/card-header" : undefined}>
        <div className="flex flex-col gap-1 @lg/card-header:flex-row @lg/card-header:items-center @lg/card-header:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {actions ? <div className="mt-3 @lg/card-header:mt-0">{actions}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasProjects ? (
          <ul className="divide-y rounded-lg border">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm sm:text-base">{project.name}</span>
                    {project.isArchived ? <Badge variant="outline">Archived</Badge> : null}
                  </div>
                  {project.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {renderActions ? (
                    renderActions(project)
                  ) : (
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        )}
      </CardContent>
    </Card>
  );
}
