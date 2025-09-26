import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AppPageLayoutProps {
  title?: string;
  description?: string;
  headingSlot?: ReactNode;
  actions?: ReactNode;
  footerSlot?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidthClassName?: string;
}

export default function AppPageLayout({
  title,
  description,
  headingSlot,
  actions,
  footerSlot,
  children,
  className,
  contentClassName,
  maxWidthClassName = "max-w-6xl",
}: AppPageLayoutProps) {
  return (
    <main className={cn("mx-auto w-full px-6 py-10", maxWidthClassName, className)}>
      <div className="flex flex-col gap-10">
        {(headingSlot || title || description || actions) && (
          <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {headingSlot ? (
              headingSlot
            ) : (
              <div className="space-y-2">
                {title ? <h1 className="text-3xl font-semibold tracking-tight">{title}</h1> : null}
                {description ? <p className="text-muted-foreground">{description}</p> : null}
              </div>
            )}
            {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
          </header>
        )}

        <div className={cn("flex flex-col gap-8", contentClassName)}>{children}</div>

        {footerSlot ? <footer>{footerSlot}</footer> : null}
      </div>
    </main>
  );
}
