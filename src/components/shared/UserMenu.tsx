"use client";

import Link from "next/link";
import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const avatarFallback = "https://avatar.vercel.sh/user";

export default function UserMenu() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);

  if (!isLoaded || !user) {
    return null;
  }

  const displayName = user.fullName ?? user.username ?? user.primaryEmailAddress?.emailAddress ?? "Account";
  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
  const imageUrl = user.imageUrl ?? avatarFallback;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2">
          <span className="inline-flex h-8 w-8 overflow-hidden rounded-full bg-muted">
            <img src={imageUrl} alt={displayName} className="h-full w-full object-cover" />
          </span>
          <span className="hidden sm:inline text-sm font-medium">{displayName}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 space-y-3">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground truncate">{displayName}</span>
          {email ? <span className="text-xs text-muted-foreground truncate">{email}</span> : null}
        </div>
        <div className="grid gap-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="justify-start gap-2"
            onClick={() => setOpen(false)}
          >
            <Link href="/account">
              <User className="h-4 w-4" />
              Manage account
            </Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-destructive"
          onClick={async () => {
            setOpen(false);
            await signOut({ redirectUrl: "/" });
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
