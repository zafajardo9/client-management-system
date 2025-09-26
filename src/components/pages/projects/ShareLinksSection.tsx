"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Copy, Link as LinkIcon } from "lucide-react";

interface ShareLinkClientShape {
  id: string;
  projectId: string;
  token: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ShareLinksSectionProps {
  projectId: string;
  initialLink: ShareLinkClientShape | null;
}

function normalizeLink(data: Record<string, unknown>): ShareLinkClientShape {
  return {
    id: String(data.id ?? ""),
    projectId: String(data.projectId ?? ""),
    token: String(data.token ?? ""),
    enabled: Boolean(data.enabled),
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
  };
}

export default function ShareLinksSection({ projectId, initialLink }: ShareLinksSectionProps) {
  const [link, setLink] = useState<ShareLinkClientShape | null>(initialLink);
  const [origin, setOrigin] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const shareUrl = useMemo(() => {
    if (!link) return null;
    return origin ? `${origin}/share/${link.token}` : `/share/${link.token}`;
  }, [link, origin]);

  const formattedUpdatedAt = useMemo(() => {
    if (!link) return null;
    const date = new Date(link.updatedAt ?? link.createdAt);
    return date.toLocaleString();
  }, [link]);

  async function handleCreate() {
    setIsCreating(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/share-links`, { method: "POST" });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Unable to create share link");
      }
      const created = normalizeLink(json.data ?? {});
      setLink(created);
      toast.success("Sharing enabled");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggle() {
    if (!link) return;
    setIsToggling(true);
    try {
      const response = await fetch(`/api/share-links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !link.enabled }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Unable to update share link");
      }
      const updated = normalizeLink(json.data ?? {});
      setLink(updated);
      toast.success(updated.enabled ? "Sharing enabled" : "Sharing disabled");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(message);
    } finally {
      setIsToggling(false);
    }
  }

  async function handleRegenerate() {
    if (!link) return;
    setIsRegenerating(true);
    try {
      const response = await fetch(`/api/share-links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerateToken: true }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Unable to regenerate link");
      }
      const updated = normalizeLink(json.data ?? {});
      setLink(updated);
      toast.success("New share link generated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(message);
    } finally {
      setIsRegenerating(false);
    }
  }

  async function handleCopy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to copy link";
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      {!link ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Share this project</CardTitle>
            <CardDescription>
              Generate a secure share link to let clients or stakeholders follow published updates.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleCreate} disabled={isCreating} className="gap-2">
              <LinkIcon className="h-4 w-4" />
              {isCreating ? "Creating..." : "Enable sharing"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-xl font-semibold">Share link</CardTitle>
              <Badge variant={link.enabled ? "default" : "secondary"} className="uppercase">
                {link.enabled ? "Active" : "Disabled"}
              </Badge>
            </div>
            <CardDescription>
              Share this URL with viewers who should see your published updates. Disable or refresh it anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="share-url">Public URL</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="share-url"
                  value={shareUrl ?? ""}
                  readOnly
                  className="sm:flex-1"
                />
                <Button variant="secondary" onClick={handleCopy} className="gap-2" disabled={!shareUrl}>
                  <Copy className="h-4 w-4" /> Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Link last updated {formattedUpdatedAt ?? "just now"}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={link.enabled ? "outline" : "default"}
                onClick={handleToggle}
                disabled={isToggling || isRegenerating}
              >
                {isToggling ? "Saving..." : link.enabled ? "Disable sharing" : "Enable sharing"}
              </Button>
              <Button
                variant="ghost"
                onClick={handleRegenerate}
                disabled={isRegenerating || isToggling}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {isRegenerating ? "Regenerating..." : "Regenerate link"}
              </Button>
            </div>
            {!link.enabled ? (
              <p className="text-xs text-muted-foreground">
                Sharing is currently disabled. Enable it to make the link accessible again.
              </p>
            ) : null}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
