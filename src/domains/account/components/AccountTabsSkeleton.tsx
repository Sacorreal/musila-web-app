export function AccountTabsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-24 rounded-md bg-muted-foreground/20" />
        ))}
      </div>
      <div className="space-y-4">
        <div className="h-32 rounded-xl bg-muted" />
        <div className="h-24 rounded-xl bg-muted" />
        <div className="h-24 rounded-xl bg-muted" />
      </div>
    </div>
  );
}
