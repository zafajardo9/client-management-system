import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { shareLinks } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";

interface PublicSharePageParams {
  token: string;
}

export default async function PublicSharePage({ params }: { params: Promise<PublicSharePageParams> }) {
  const { token } = await params;
  const result = await shareLinks.getPublicUpdatesByToken(token);

  if (!result.success) {
    if (result.error.code === "NOT_FOUND") {
      notFound();
    }

    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Unable to load updates</h1>
          <p className="text-sm text-muted-foreground">{result.error.message}</p>
        </div>
      </main>
    );
  }

  const { project, items, link } = result.data;

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <header className="space-y-4 rounded-xl border bg-card px-6 py-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Project</p>
            <h1 className="text-2xl font-semibold leading-tight">{project.name}</h1>
          </div>
          <Badge variant="secondary" className="uppercase tracking-wide">
            Share ID · {link.token.slice(0, 8)}
          </Badge>
        </div>
        {project.description ? (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        ) : null}
      </header>

      <section aria-labelledby="updates-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="updates-heading" className="text-lg font-semibold">
            Latest published updates
          </h2>
          <p className="text-xs text-muted-foreground">Most recent first</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            No published updates yet. Check back soon.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((update) => (
              <article key={update.id} className="rounded-xl border bg-card p-6 shadow-sm transition hover:border-primary/40">
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold leading-tight">{update.title}</h3>
                    <time className="text-xs text-muted-foreground" dateTime={update.createdAt.toISOString()}>
                      {new Date(update.createdAt).toLocaleString()}
                    </time>
                  </div>
                  {update.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {update.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="uppercase">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </header>

                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{update.bodyMd}</ReactMarkdown>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t pt-6 text-center text-xs text-muted-foreground">
        Updates provided via secure share link. Access last refreshed on {new Date(link.updatedAt).toLocaleString()}.
      </footer>
    </main>
  );
}
