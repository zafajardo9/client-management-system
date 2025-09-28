"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { CollaboratorCandidate } from "@/lib/actions/members/searchCollaboratorCandidates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: Array<{ value: "EDITOR" | "VIEWER"; label: string; description: string }> = [
  {
    value: "EDITOR",
    label: "Editor",
    description: "Can create and edit updates.",
  },
  {
    value: "VIEWER",
    label: "Viewer",
    description: "Can only view updates.",
  },
];

const MIN_QUERY_LENGTH = 2;

interface CollaboratorsManagerProps {
  projectId: string;
}

export default function CollaboratorsManager({ projectId }: CollaboratorsManagerProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CollaboratorCandidate[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setHighlightIndex(-1);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }

    return undefined;
  }, [dropdownOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setDropdownOpen(false);
      setHighlightIndex(-1);
      setSearching(false);
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `/api/projects/${projectId}/members/search?q=${encodeURIComponent(trimmed)}&limit=5`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          setSuggestions([]);
          setDropdownOpen(true);
          setHighlightIndex(-1);
          return;
        }

        const json = await response.json();
        const data = (json.data ?? []) as CollaboratorCandidate[];
        setSuggestions(data);
        setDropdownOpen(true);
        setHighlightIndex(data.length > 0 ? 0 : -1);
      } catch (fetchError) {
        if ((fetchError as Error).name !== "AbortError") {
          setSuggestions([]);
          setDropdownOpen(true);
          setHighlightIndex(-1);
        }
      } finally {
        setSearching(false);
      }
    };

    run();

    return () => controller.abort();
  }, [projectId, query]);

  useEffect(() => {
    if (!dropdownOpen) {
      setHighlightIndex(-1);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (suggestions.length === 0) {
      setHighlightIndex(-1);
    } else if (highlightIndex === -1) {
      setHighlightIndex(0);
    } else if (highlightIndex >= suggestions.length) {
      setHighlightIndex(0);
    }
  }, [suggestions, highlightIndex]);

  const handleSelectCandidate = (candidate: CollaboratorCandidate) => {
    setEmail(candidate.email);
    setQuery(candidate.email);
    setSuggestions([]);
    setDropdownOpen(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setDropdownOpen(false);
    setHighlightIndex(-1);

    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, role }),
      });

      const json = await response.json();
      if (!response.ok) {
        const message = json?.error?.message ?? "Failed to add collaborator.";
        throw new Error(message);
      }

      setSuccess("Collaborator added.");
      setEmail("");
      setQuery("");
      setSuggestions([]);
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unknown error";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const roleDescription = useMemo(
    () => ROLE_OPTIONS.find((option) => option.value === role)?.description ?? "",
    [role]
  );

  return (
    <section className="space-y-4 rounded-md border p-4 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Invite collaborators</h3>
        <p className="text-xs text-muted-foreground">
          Share access with teammates who already have an account in your workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="collaborator-email">User email</Label>
          <div className="relative" ref={containerRef}>
            <Input
              id="collaborator-email"
              ref={inputRef}
              type="email"
              placeholder="teammate@example.com"
              autoComplete="email"
              value={email}
              disabled={submitting}
              onChange={(event) => {
                const value = event.target.value;
                setEmail(value);
                setQuery(value);
              }}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setDropdownOpen(true);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setDropdownOpen(false);
                  setHighlightIndex(-1);
                  return;
                }

                if (!dropdownOpen || suggestions.length === 0) {
                  return;
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setHighlightIndex((prev) => {
                    const next = prev + 1;
                    return next >= suggestions.length ? 0 : next;
                  });
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setHighlightIndex((prev) => {
                    const next = prev - 1;
                    return next < 0 ? suggestions.length - 1 : next;
                  });
                }

                if (event.key === "Enter") {
                  if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
                    event.preventDefault();
                    handleSelectCandidate(suggestions[highlightIndex]);
                  }
                }
              }}
            />

            {query.trim().length >= MIN_QUERY_LENGTH ? (
              <div
                className={cn(
                  "absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border bg-background shadow-lg",
                  dropdownOpen ? "" : "hidden"
                )}
              >
                <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Suggestions
                </div>
                {searching ? (
                  <div className="px-3 py-4 text-xs text-muted-foreground">Searching for matching users…</div>
                ) : suggestions.length > 0 ? (
                  <ul className="max-h-60 divide-y overflow-auto">
                    {suggestions.map((candidate, index) => (
                      <li key={candidate.id}>
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm",
                            highlightIndex === index ? "bg-muted" : "hover:bg-muted"
                          )}
                          onMouseEnter={() => setHighlightIndex(index)}
                          onClick={() => handleSelectCandidate(candidate)}
                        >
                          <div>
                            <p className="font-medium leading-tight">{candidate.email}</p>
                            {candidate.name ? (
                              <p className="text-xs text-muted-foreground">{candidate.name}</p>
                            ) : null}
                          </div>
                          <span className="text-xs uppercase text-muted-foreground">Select</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-1 px-3 py-4 text-xs text-muted-foreground">
                    <p>No matching workspace users found.</p>
                    <p>External sharing for non-account holders is in progress.</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {query.trim().length < MIN_QUERY_LENGTH ? (
            <p className="text-xs text-muted-foreground">
              Type at least {MIN_QUERY_LENGTH} characters to search your workspace directory.
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="collaborator-role">Role</Label>
          <Select value={role} onValueChange={(value) => setRole(value as typeof role)} disabled={submitting}>
            <SelectTrigger id="collaborator-role" className="w-full smtyw-60">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {roleDescription ? (
            <p className="text-xs text-muted-foreground">{roleDescription}</p>
          ) : null}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Inviting…" : "Invite"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setEmail("");
              setQuery("");
              setSuggestions([]);
              setError(null);
              setSuccess(null);
              setDropdownOpen(false);
              setHighlightIndex(-1);
              inputRef.current?.focus();
            }}
            disabled={submitting}
          >
            Clear
          </Button>
        </div>
      </form>

      <p className="text-xs text-muted-foreground">
        Need to invite someone without an account? Ask them to sign up first, then share the project here.
      </p>
    </section>
  );
}
