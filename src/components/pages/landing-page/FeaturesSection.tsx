import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users, Share2, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";
import EmptyState from "@/components/shared/EmptyState";

const ICONS = { Zap, Users, Share2, ShieldCheck } as const;

export function FeaturesSection() {
  const features = siteConfig.landing?.features;

  if (!features || features.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <EmptyState
          title="No features configured"
          description="Provide landing.features in src/config/site.ts to populate this section."
        />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl py-12 md:py-16">
      <div className="mb-8 space-y-2 px-6">
        <Badge variant="outline">Why choose us</Badge>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Built for speed and clarity</h2>
        <p className="text-muted-foreground">Everything you need to share progress updates with clients.</p>
      </div>
      <div className="grid gap-4 px-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => {
          const Icon = f.icon ? ICONS[f.icon] ?? ShieldCheck : ShieldCheck;
          return (
            <Card key={f.title} className="p-5 space-y-3">
              <Icon className="h-5 w-5" />
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-muted-foreground">{f.description}</div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
