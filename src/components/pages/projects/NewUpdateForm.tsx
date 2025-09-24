"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface NewUpdateFormProps {
  projectId: string;
  className?: string;
}

export default function NewUpdateForm({ projectId, className }: NewUpdateFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [bodyMd, setBodyMd] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("PUBLISHED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title,
          bodyMd,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          status,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Failed to create update");
      }

      setTitle("");
      setBodyMd("");
      setTags("");
      setStatus("PUBLISHED");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle>Post update</CardTitle>
        <CardDescription>Share the latest progress with your stakeholders.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-1">
        <Label htmlFor="update-title">Title</Label>
        <Input
          id="update-title"
          placeholder="Update title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="update-body">Body (Markdown)</Label>
        <Textarea
          id="update-body"
          placeholder="Write your update in Markdown"
          value={bodyMd}
          onChange={(event) => setBodyMd(event.target.value)}
          rows={6}
          required
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="update-tags">Tags (comma separated)</Label>
        <Input
          id="update-tags"
          placeholder="e.g. release, backend, ui"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="update-status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
          <SelectTrigger id="update-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Posting..." : "Post Update"}
      </Button>
        </form>
      </CardContent>
    </Card>
  );
}
