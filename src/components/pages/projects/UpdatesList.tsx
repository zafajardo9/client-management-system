import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type UpdateListItem = {
  id: string;
  title: string;
  createdAt: Date;
  status: string;
  tags: string[];
};

interface UpdatesListProps {
  projectId: string;
  items: UpdateListItem[];
  className?: string;
}

export function UpdatesList({ projectId, items, className }: UpdatesListProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle>Updates</CardTitle>
        <CardDescription>Recent updates for this project.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet.</p>
        ) : (
          <ul className="divide-y rounded-md border">
            {items.map((update) => (
              <li key={update.id} className="space-y-1 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-medium">
                    <Link href={`/projects/${projectId}/updates/${update.id}`} className="hover:underline">
                      {update.title}
                    </Link>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(update.createdAt).toLocaleString()} • {update.status}
                  </div>
                </div>
                {update.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {update.tags.map((tag) => (
                      <span key={tag} className="rounded bg-muted px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
