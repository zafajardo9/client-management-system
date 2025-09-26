import Link from "next/link";

import { cn } from "@/lib/utils";

export type ProjectSection = {
  value: string;
  label: string;
  description?: string;
};

interface ProjectSidebarNavProps {
  projectId: string;
  items: ProjectSection[];
  activeValue: string;
}

export default function ProjectSidebarNav({ projectId, items, activeValue }: ProjectSidebarNavProps) {
  return (
    <nav className="rounded-xl border bg-card p-2 shadow-sm">
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = item.value === activeValue;
          const href = item.value === "updates" ? `/projects/${projectId}` : `/projects/${projectId}?section=${item.value}`;

          return (
            <li key={item.value}>
              <Link
                href={href}
                prefetch={false}
                className={cn(
                  "flex flex-col rounded-lg px-3 py-2 transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted/70"
                )}
              >
                <span className="text-sm font-medium leading-none">{item.label}</span>
                {item.description ? (
                  <span className={cn("text-xs", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}> 
                    {item.description}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
