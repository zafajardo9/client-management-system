"use client";

import { useState, FormEvent } from "react";

type LinkItem = { id: string; slug: string; enabled: boolean; createdAt: Date };

export function ShareLinksSection({
  projectId,
  links,
}: {
  projectId: string;
  links: LinkItem[];
}) {
  const [items, setItems] = useState<LinkItem[]>(links);
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState<"ALL" | "PUBLISHED_ONLY">("ALL");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        slug,
        visibility,
        tagFilter: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const res = await fetch(`/api/projects/${projectId}/share-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed to create link");
      // Re-fetch or optimistically add new link (minimal optimistic: add with provided slug)
      setItems((prev) => [
        {
          id: json.data.id ?? Math.random().toString(36).slice(2),
          slug,
          enabled: true,
          createdAt: new Date(),
        },
        ...prev,
      ]);
      setSlug("");
      setTags("");
      setVisibility("ALL");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function toggleEnabled(id: string, enabled: boolean) {
    try {
      const res = await fetch(`/api/share-links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed to update link");
      setItems((prev) => prev.map((l) => (l.id === id ? { ...l, enabled } : l)));
    } catch (err) {
      // no-op UI toast; use alert for now
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function revoke(id: string) {
    if (!confirm("Revoke this share link?")) return;
    try {
      const res = await fetch(`/api/share-links/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed to revoke link");
      setItems((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onCreate} className="rounded-md border p-4 space-y-3">
        <div className="font-medium">Create Share Link</div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Slug</label>
          <input
            className="border rounded px-3 py-2"
            placeholder="unique-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Visibility</label>
          <select
            className="border rounded px-3 py-2"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "ALL" | "PUBLISHED_ONLY")}
          >
            <option value="ALL">ALL</option>
            <option value="PUBLISHED_ONLY">PUBLISHED_ONLY</option>
          </select>
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Tag Filter (comma separated)</label>
          <input
            className="border rounded px-3 py-2"
            placeholder="e.g. release, ui"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          className="inline-flex items-center rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Link"}
        </button>
      </form>

      <div className="space-y-2">
        <div className="font-medium">Existing Links</div>
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No share links yet.</div>
        ) : (
          <ul className="rounded-md border divide-y">
            {items.map((l) => (
              <li key={l.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">{l.slug}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(l.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs">
                      URL: <a className="text-primary hover:underline" href={`/share/${l.slug}`} target="_blank">/share/{l.slug}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(`${location.origin}/share/${l.slug}`)}
                      className="border rounded px-3 py-1 text-sm"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleEnabled(l.id, !l.enabled)}
                      className="border rounded px-3 py-1 text-sm"
                    >
                      {l.enabled ? "Disable" : "Enable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => revoke(l.id)}
                      className="border border-red-500 text-red-600 rounded px-3 py-1 text-sm"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
