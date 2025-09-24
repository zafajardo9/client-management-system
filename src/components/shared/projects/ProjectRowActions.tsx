"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectRowActionsProps {
  projectId: string;
  isArchived: boolean;
}

export function ProjectRowActions({ projectId, isArchived }: ProjectRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mutate = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, init);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload?.error?.message ?? "Something went wrong";
      throw new Error(message);
    }
    return payload;
  };

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        toast.error(message);
      }
    });

  const archiveOrRestore = async () => {
    if (isArchived) {
      await mutate(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: false }),
      });
      toast.success("Project restored");
      return;
    }

    await mutate(`/api/projects/${projectId}`, { method: "DELETE" });
    toast.success("Project archived");
  };

  const deleteProject = async () => {
    await mutate(`/api/projects/${projectId}/delete`, { method: "POST" });
    toast.success("Project deleted");
  };

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending}>
            {isArchived ? "Restore" : "Archive"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArchived ? "Restore project" : "Archive project"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArchived
                ? "This project will become active again. Collaborators will regain access."
                : "Archiving hides the project from active views. You can restore it anytime."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => run(archiveOrRestore)}
            >
              {isArchived ? "Restore" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            disabled={isPending}
          >
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project permanently</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All updates, share links, and member access will be removed forever.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => run(deleteProject)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
