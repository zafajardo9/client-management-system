export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-40 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-neutral-200 rounded animate-pulse" />
      </div>
      <div className="rounded-md border p-4 space-y-3">
        <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse" />
        <div className="h-9 w-full bg-neutral-200 rounded animate-pulse" />
        <div className="h-24 w-full bg-neutral-200 rounded animate-pulse" />
        <div className="h-9 w-36 bg-neutral-200 rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse" />
        <div className="rounded-md border divide-y">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse" />
                <div className="h-3 w-64 bg-neutral-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
