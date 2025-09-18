export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <div className="space-y-2">
        <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse" />
        <div className="h-7 w-48 bg-neutral-200 rounded animate-pulse" />
      </div>
      <div className="rounded-md border p-4 space-y-3">
        <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse" />
        <div className="h-9 w-full bg-neutral-200 rounded animate-pulse" />
        <div className="h-48 w-full bg-neutral-200 rounded animate-pulse" />
        <div className="h-9 w-full bg-neutral-200 rounded animate-pulse" />
        <div className="flex gap-3">
          <div className="h-9 w-32 bg-neutral-200 rounded animate-pulse" />
          <div className="h-9 w-24 bg-neutral-200 rounded animate-pulse" />
        </div>
      </div>
    </main>
  );
}
