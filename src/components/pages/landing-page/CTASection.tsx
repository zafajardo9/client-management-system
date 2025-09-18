import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import EmptyState from "@/components/shared/EmptyState";

export function CTASection() {
  const title = siteConfig.landing?.ctaTitle;
  const description = siteConfig.landing?.ctaDescription;

  if (!title || !description) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <EmptyState
          title="CTA content not configured"
          description="Provide landing.ctaTitle and landing.ctaDescription in src/config/site.ts."
        />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <Card className="p-8 md:p-10 text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/sign-up">Get started — free</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/sign-in">I already have an account</Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
