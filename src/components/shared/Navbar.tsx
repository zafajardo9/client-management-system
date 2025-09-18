"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`text-sm px-2 py-1 rounded-md transition-colors ${
        active ? "bg-neutral-100 text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
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
            ClientMgmt
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <SignedIn>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </SignedIn>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <SignedOut>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: { userButtonPopoverCard: "shadow-md" },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
