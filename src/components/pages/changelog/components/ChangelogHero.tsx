import Link from "next/link";

import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type ChangelogMetrics = {
  shipped: number;
  inProgress: number;
  planned: number;
};

export default function ChangelogHero({ metrics }: { metrics: ChangelogMetrics }) {
  const stats = [
    { label: "Shipped", value: metrics.shipped, tone: "bg-emerald-500/80 dark:bg-emerald-400/80" },
    { label: "In Progress", value: metrics.inProgress, tone: "bg-amber-500/80 dark:bg-amber-400/80" },
    { label: "Planned", value: metrics.planned, tone: "bg-sky-500/80 dark:bg-sky-400/80" },
  ];

  return (
    <Card className="relative overflow-hidden border-border/80 shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/10 via-transparent to-transparent blur-2xl" />
      <CardContent className="relative flex flex-col gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader
          title="Product changelog"
          subtitle="Follow the narrative of how the client management system evolves—from growth initiatives to collaborative tooling and governance upgrades."
          actions={
            <Button asChild size="sm">
              <Link href="/waitlist">Join the waitlist</Link>
            </Button>
          }
        />
        <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1 rounded-lg border border-border/70 bg-card/80 px-4 py-3 shadow-xs"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </span>
              <span className="text-2xl font-semibold tracking-tight">{stat.value}</span>
              <span className="text-xs text-muted-foreground">Active entries</span>
              <span className={`mt-2 h-1 w-full rounded-full ${stat.tone}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
