"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

interface ShareLinkItem {
  id: string;
  slug: string;
  enabled: boolean;
  createdAt: Date;
}

interface ShareLinksSectionProps {
  projectId: string;
  links: ShareLinkItem[];
}

export default function ShareLinksSection({ projectId, links }: ShareLinksSectionProps) {
  const [items, setItems] = useState<ShareLinkItem[]>(links);
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState<"ALL" | "PUBLISHED_ONLY">("ALL");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        slug,
        visibility,
        tagFilter: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const response = await fetch(`/api/projects/${projectId}/share-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Failed to create link");
      }

      setItems((prev) => [
        {
          id: json.data?.id ?? crypto.randomUUID(),
          slug,
          enabled: true,
          createdAt: new Date(),
        },
        ...prev,
      ]);

      toast.success("Share link created");
      setSlug("");
      setTags("");
      setVisibility("ALL");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleEnabled(id: string, enabled: boolean) {
    try {
      const response = await fetch(`/api/share-links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Failed to update link");
      }

      setItems((prev) => prev.map((link) => (link.id === id ? { ...link, enabled } : link)));
      toast.success(enabled ? "Link enabled" : "Link disabled");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(message);
    }
  }

  async function revoke(id: string) {
    try {
      const response = await fetch(`/api/share-links/${id}`, { method: "DELETE" });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Failed to revoke link");
      }

      setItems((prev) => prev.filter((link) => link.id !== id));
      toast.success("Link revoked");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(message);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onCreate} className="space-y-3 rounded-md border p-4">
        <div className="font-medium">Create Share Link</div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Slug</label>
          <input
            className="rounded border px-3 py-2"
            placeholder="unique-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Visibility</label>
          <select
            className="rounded border px-3 py-2"
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as "ALL" | "PUBLISHED_ONLY")}
          >
            <option value="ALL">ALL</option>
            <option value="PUBLISHED_ONLY">PUBLISHED_ONLY</option>
          </select>
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Tag Filter (comma separated)</label>
          <input
            className="rounded border px-3 py-2"
            placeholder="e.g. release, ui"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center rounded bg-black px-4 py-2 text-white disabled:opacity-50"
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
          <ul className="divide-y rounded-md border">
            {items.map((link) => (
              <li key={link.id} className="space-y-2 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">{link.slug}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(link.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs">
                      URL: {" "}
                      <a className="text-primary hover:underline" href={`/share/${link.slug}`} target="_blank">
                        /share/{link.slug}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/share/${link.slug}`)}
                      className="rounded border px-3 py-1 text-sm"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleEnabled(link.id, !link.enabled)}
                      className="rounded border px-3 py-1 text-sm"
                    >
                      {link.enabled ? "Disable" : "Enable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => revoke(link.id)}
                      className="rounded border border-destructive px-3 py-1 text-sm text-destructive"
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
