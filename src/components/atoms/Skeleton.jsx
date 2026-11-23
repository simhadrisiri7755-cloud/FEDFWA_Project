export default function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`rounded-2xl bg-surface-2 motion-safe:animate-shimmer ${className}`} />;
}

/** Route-level loading placeholder (used as the Suspense fallback for lazy pages). */
export function PageSkeleton() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}
