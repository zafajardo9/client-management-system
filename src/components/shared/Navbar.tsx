"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { siteConfig } from "@/config/site";
import { appNavItems } from "@/lib/constants/navItems";
import UserMenu from "@/components/shared/UserMenu";
import { cn } from "@/lib/utils";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight">
            {siteConfig.name || "App"}
          </Link>
          <SignedIn>
            <nav className="hidden md:flex items-center gap-1">
              {appNavItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </SignedIn>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedOut>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
