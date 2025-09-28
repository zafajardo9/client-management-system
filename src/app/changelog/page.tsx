import { Metadata } from "next";

import rawChangelog from "@/content/changelog.json";
import {
  ChangelogHero,
  ChangelogQuarterSection,
  ChangelogStatusLegend,
  changelogDataSchema,
} from "@/components/pages/changelog";
import type { ChangelogData } from "@/components/pages/changelog";
import { AppPageLayout } from "@/components/shared/layouts";
import { Accordion } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Product Changelog",
  description:
    "Track releases, in-progress work, and planned initiatives for the client management system.",
};

export const revalidate = 60 * 30; // 30 minutes

const changelog: ChangelogData = changelogDataSchema.parse(rawChangelog);

const metrics = changelog.quarters.reduce(
  (acc, quarter) => {
    quarter.entries.forEach((entry) => {
      if (entry.status === "shipped") {
        acc.shipped += 1;
      } else if (entry.status === "in-progress") {
        acc.inProgress += 1;
      } else if (entry.status === "planned") {
        acc.planned += 1;
      }
    });
    return acc;
  },
  { shipped: 0, inProgress: 0, planned: 0 },
);

const defaultAccordionValue = changelog.quarters[0]?.id ? [changelog.quarters[0].id] : [];

export default function ChangelogPage() {
  return (
    <div className="relative isolate min-h-screen bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/10 via-primary/0 to-transparent blur-3xl"
        aria-hidden
      />
      <AppPageLayout
        headingSlot={<ChangelogHero metrics={metrics} />}
        contentClassName="gap-10"
        maxWidthClassName="max-w-6xl"
        className="relative"
      >
        <ChangelogStatusLegend />
        <Accordion
          type="multiple"
          defaultValue={defaultAccordionValue}
          className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
        >
          {changelog.quarters.map((quarter) => (
            <ChangelogQuarterSection key={quarter.id} quarter={quarter} />
          ))}
        </Accordion>
      </AppPageLayout>
    </div>
  );
}
