"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function TagInput({
  value,
  onChange,
  placeholder = "Add a tag",
  className,
  disabled,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const tags = value.map((tag) => tag.trim()).filter(Boolean);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...tags, trimmed]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((item) => item !== tag));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      addTag(draft);
    }

    if (event.key === "Backspace" && draft.length === 0 && tags.length > 0) {
      event.preventDefault();
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleBlur = () => {
    if (draft.trim()) addTag(draft);
  };

  return (
    <div
      className={cn(
        "flex min-h-[40px] flex-wrap items-center gap-2 rounded-md border border-input bg-background px-2 py-1.5 text-sm focus-within:border-primary",
        disabled ? "opacity-60" : undefined,
        className
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
        >
          {tag}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-5 w-5 text-muted-foreground hover:text-foreground"
            onClick={() => removeTag(tag)}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove tag {tag}</span>
          </Button>
        </span>
      ))}
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="flex-1 border-none bg-transparent px-0 py-1 text-sm shadow-none focus-visible:ring-0"
        placeholder={tags.length === 0 ? placeholder : undefined}
        disabled={disabled}
      />
    </div>
  );
}
