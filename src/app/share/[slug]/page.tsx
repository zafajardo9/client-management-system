import { shareLinks } from "@/lib/actions";

export default async function PublicSharePage({ params }: { params: { slug: string } }) {
  const res = await shareLinks.getPublicUpdatesBySlug(params.slug);
  if (!res.success) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-red-600 text-sm">{res.error.message}</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Public Updates</h1>
        <p className="text-sm text-muted-foreground">
          Visibility: {res.data.link.visibility}
          {res.data.link.tagFilter.length ? ` • Tags: ${res.data.link.tagFilter.join(", ")}` : null}
        </p>
      </header>
      <section>
        {res.data.items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No updates available.</div>
        ) : (
          <ul className="divide-y rounded-md border">
            {res.data.items.map((u) => (
              <li key={u.id} className="p-4 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-medium">{u.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleString()}
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
        )}
      </section>
    </main>
  );
}
