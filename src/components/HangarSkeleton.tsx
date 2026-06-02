import { GlassSkeleton } from "./Skeleton";

export function HangarSkeleton() {
  return (
    <section id="projects" className="py-20 px-6">
      <h2 className="text-3xl font-mono text-[var(--accent)] mb-12 text-center">
        ▸ PROJETOS
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <GlassSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
