import Link from "next/link";

export function UpdatesList({
  projectId,
  items,
}: {
  projectId: string;
  items: Array<{ id: string; title: string; createdAt: Date; status: string; tags: string[] }>;
}) {
  if (!items.length) {
    return <div className="text-sm text-muted-foreground">No updates yet.</div>;
  }
  return (
    <ul className="divide-y rounded-md border">
      {items.map((u) => (
        <li key={u.id} className="p-4 space-y-1">
          <div className="flex items-center justify-between gap-4">
            <div className="font-medium">
              <Link href={`/projects/${projectId}/updates/${u.id}`} className="hover:underline">
                {u.title}
              </Link>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(u.createdAt).toLocaleString()} • {u.status}
            </div>
          </div>
          {u.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {u.tags.map((t) => (
                <span key={t} className="rounded bg-neutral-100 px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
