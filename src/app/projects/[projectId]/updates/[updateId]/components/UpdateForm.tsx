"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { MarkdownEditor, TagInput } from "@/components/shared";

export function UpdateForm({
  update,
  projectId,
}: {
  projectId: string;
  update: { id: string; title: string; bodyMd: string; status: string; tags: string[] };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(update.title);
  const [bodyMd, setBodyMd] = useState(update.bodyMd);
  const [tags, setTags] = useState<string[]>(update.tags ?? []);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    update.status as "DRAFT" | "PUBLISHED" | "ARCHIVED"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!bodyMd.trim()) {
        throw new Error("Body cannot be empty.");
      }

      const payload = {
        title,
        bodyMd,
        tags: tags.map((tag) => tag.trim()).filter(Boolean),
        status,
      };
      const res = await fetch(`/api/updates/${update.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed to update");
      setSuccess("Saved successfully.");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this update? This cannot be undone.")) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/updates/${update.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed to delete");
      // Go back to project page after deletion
      router.push(`/projects/${projectId}`);
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
      <div className="space-y-2" data-color-mode="light">
        <label className="text-sm font-medium">Body (Markdown)</label>
        <div className="overflow-hidden rounded border">
          <MarkdownEditor value={bodyMd} onChange={(value) => setBodyMd(value ?? "")} height={280} preview="edit" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Tags</label>
        <TagInput value={tags} onChange={setTags} placeholder="Press enter to add a tag" disabled={loading} />
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
      {success && <div className="text-sm text-green-700">{success}</div>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center rounded border border-red-500 text-red-600 px-4 py-2 disabled:opacity-50"
          disabled={loading}
        >
          Delete
        </button>
      </div>
    </form>
  );
}
