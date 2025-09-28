import { CHANGELOG_STATUS_META } from "../constants";
import { Badge } from "@/components/ui/badge";

export default function ChangelogStatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
      {Object.entries(CHANGELOG_STATUS_META).map(([key, meta]) => (
        <div key={key} className="flex items-start gap-2">
          <Badge variant={meta.badgeVariant}>{meta.label}</Badge>
          <p className="max-w-xs text-xs text-muted-foreground">{meta.description}</p>
        </div>
      ))}
    </div>
  );
}
