import { Filter, X } from 'lucide-react'

type InviteStatusFilter = 'all' | 'used' | 'pending'

interface InviteFiltersToolbarProps {
  status: InviteStatusFilter
  onStatusChange: (status: InviteStatusFilter) => void
}

export function InviteFiltersToolbar({ status, onStatusChange }: InviteFiltersToolbarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Filter className="h-3.5 w-3.5" />
        Filtros
      </div>
      <div className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as InviteStatusFilter)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="used">Usadas</option>
        </select>
        {status !== 'all' && (
          <button
            onClick={() => onStatusChange('all')}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
