export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[var(--border)] rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function GlassSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`glass border-[var(--border)] rounded-xl p-6 ${className}`}>
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}
