import { Search, X, Filter } from 'lucide-react'
import { AffiliateStatus, AffiliateTier } from '@/src/domains/admin/affiliates/admin-affiliates.types'

const TIER_LABELS: Record<string, string> = {
  standard: 'Standard',
  ambassador: 'Ambassador',
  partner: 'Partner',
}

interface AffiliateFiltersToolbarProps {
  searchInput: string
  onSearchInputChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  tier: string
  onTierChange: (value: string) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function AffiliateFiltersToolbar({
  searchInput,
  onSearchInputChange,
  status,
  onStatusChange,
  tier,
  onTierChange,
  hasActiveFilters,
  onClearFilters,
}: AffiliateFiltersToolbarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Filter className="h-3.5 w-3.5" />
        Filtros
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            placeholder="Buscar por nombre o email…"
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {searchInput && (
            <button
              onClick={() => onSearchInputChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Todos los estados</option>
          {Object.values(AffiliateStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={tier}
          onChange={(e) => onTierChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Todos los niveles</option>
          {Object.values(AffiliateTier).map((t) => (
            <option key={t} value={t}>{TIER_LABELS[t]}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
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
