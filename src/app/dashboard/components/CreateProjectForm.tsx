"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function CreateProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed to create project");
      setName("");
      setDescription("");
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
        <label className="text-sm font-medium">Name</label>
        <input
          className="border rounded px-3 py-2"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="border rounded px-3 py-2"
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        type="submit"
        className="inline-flex items-center rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}
