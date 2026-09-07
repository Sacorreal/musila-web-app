export function SocietyAffiliationsTableSkeleton() {
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center justify-between gap-3 p-4">
          <div className="space-y-2">
            <div className="h-4 w-40 rounded-md bg-muted" />
            <div className="h-3 w-56 rounded-md bg-muted" />
            <div className="h-5 w-28 rounded-md bg-muted" />
          </div>
          <div className="h-8 w-24 shrink-0 rounded-md bg-muted" />
        </div>
      ))}
    </div>
  )
}
