import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import EmptyState from "@/components/shared/EmptyState";

export function Footer() {
  const links = siteConfig.footer?.links ?? [];
  const year = new Date().getFullYear();

  if (links.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <EmptyState
          title="Footer links not configured"
          description="Provide footer.links in src/config/site.ts to populate the footer."
        />
      </div>
    );
  }
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">© {year} {siteConfig.name}. All rights reserved.</div>
        <nav className="text-sm flex items-center gap-4 text-muted-foreground">
          {links.map((l) =>
            l.external ? (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="hover:text-foreground">
                {l.label}
              </a>
            ) : l.href === "/dashboard" ? (
              <SignedIn key={l.href}>
                <Link href={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              </SignedIn>
            ) : (
              <Link key={l.href} href={l.href} className="hover:text-foreground">
                {l.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </footer>
  );
}
