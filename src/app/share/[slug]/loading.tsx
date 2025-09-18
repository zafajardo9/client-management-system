export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-48 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-neutral-200 rounded animate-pulse" />
      </div>
      <div className="rounded-md border divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="h-4 w-56 bg-neutral-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-neutral-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-5 w-12 bg-neutral-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
