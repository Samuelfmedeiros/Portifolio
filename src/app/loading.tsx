import { GlassSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen pt-24 px-6 bg-[var(--bg-primary)]">
      {/* Hero skeleton */}
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <div className="bg-[var(--border)] h-16 w-64 mx-auto rounded mb-4" />
        <div className="bg-[var(--border)] h-6 w-48 mx-auto rounded" />
      </div>

      {/* Grid skeleton — GlassSkeleton mantém consistência visual */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <GlassSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
