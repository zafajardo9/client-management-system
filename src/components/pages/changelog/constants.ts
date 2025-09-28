import type { VariantProps } from "class-variance-authority";

import type { ChangelogEntry } from "./types";
import type { badgeVariants } from "@/components/ui/badge";

export const CHANGELOG_STATUS_META: Record<
  ChangelogEntry["status"],
  {
    label: string;
    description: string;
    badgeVariant: VariantProps<typeof badgeVariants>["variant"];
  }
> = {
  shipped: {
    label: "Shipped",
    description: "Released to all creators and clients.",
    badgeVariant: "default",
  },
  "in-progress": {
    label: "In Progress",
    description: "Currently being built or rolling out to beta cohorts.",
    badgeVariant: "secondary",
  },
  planned: {
    label: "Planned",
    description: "On the roadmap with discovery or kickoff upcoming.",
    badgeVariant: "outline",
  },
};
