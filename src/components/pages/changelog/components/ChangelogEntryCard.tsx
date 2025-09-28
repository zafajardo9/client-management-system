import Link from "next/link";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CHANGELOG_STATUS_META } from "../constants";
import type { ChangelogEntry } from "../types";

export default function ChangelogEntryCard({ entry }: { entry: ChangelogEntry }) {
  const publishedAt = format(new Date(entry.date), "MMM d, yyyy");
  const status = CHANGELOG_STATUS_META[entry.status];

  return (
    <Card className="border-border/70 bg-background/80 shadow-sm backdrop-blur">
      <CardHeader className="gap-3 border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={status.badgeVariant}>{status.label}</Badge>
          <span className="text-xs text-muted-foreground">{publishedAt}</span>
        </div>
        <CardTitle className="text-xl font-semibold leading-snug">{entry.title}</CardTitle>
        <CardDescription>{entry.summary}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 py-6">
        {entry.tags.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="uppercase tracking-wide">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        {entry.links?.length ? (
          <div className="flex flex-wrap items-center gap-3">
            {entry.links.map((link) => (
              <Button key={link.href} asChild variant="link" className="px-0">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
