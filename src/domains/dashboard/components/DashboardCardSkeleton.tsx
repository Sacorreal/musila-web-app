// Skeleton reutilizable para tarjetas/KPIs del dashboard (evita CLS reservando
// el espacio del contenido asíncrono).
export function DashboardCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-28 animate-pulse rounded-2xl border border-border/60 bg-muted/40 ${className}`}
      aria-hidden="true"
    />
  )
}

export function DashboardCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <DashboardCardSkeleton key={i} />
      ))}
    </div>
  )
}
