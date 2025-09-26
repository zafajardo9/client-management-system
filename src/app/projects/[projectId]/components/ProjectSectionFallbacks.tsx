import { Skeleton } from "@/components/ui/skeleton";

export function UpdatesSectionFallback() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="border-b px-6 py-4">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3 px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-3 w-28" />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 2 }).map((_, tagIndex) => (
                  <Skeleton key={tagIndex} className="h-5 w-16" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShareLinksSectionFallback() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-6 shadow-sm">
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="rounded-lg border shadow-sm">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2 border-b px-6 py-4 last:border-b-0">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CollaboratorsSectionFallback() {
  return (
    <div className="rounded-lg border p-6 shadow-sm">
      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
