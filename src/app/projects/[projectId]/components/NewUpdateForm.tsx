"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function NewUpdateForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [bodyMd, setBodyMd] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("PUBLISHED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        projectId,
        title,
        bodyMd,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status,
      };
      const res = await fetch(`/api/projects/${projectId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed to create update");
      setTitle("");
      setBodyMd("");
      setTags("");
      setStatus("PUBLISHED");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-1">
        <label className="text-sm font-medium">Title</label>
        <input
          className="border rounded px-3 py-2"
          placeholder="Update title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Body (Markdown)</label>
        <textarea
          className="border rounded px-3 py-2"
          placeholder="Write your update in Markdown"
          value={bodyMd}
          onChange={(e) => setBodyMd(e.target.value)}
          rows={6}
          required
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Tags (comma separated)</label>
        <input
          className="border rounded px-3 py-2"
          placeholder="e.g. release, backend, ui"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Status</label>
        <select
          className="border rounded px-3 py-2"
          value={status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setStatus(e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED")
          }
        >
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        type="submit"
        className="inline-flex items-center rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Posting..." : "Post Update"}
      </button>
    </form>
  );
}
