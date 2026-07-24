import { Search, X, Filter } from 'lucide-react'
import { UserPlanType } from '@/src/domains/users/types/user.types'

interface UserFiltersToolbarProps {
  searchInput: string
  onSearchInputChange: (value: string) => void
  planType: string
  onPlanTypeChange: (value: string) => void
  isVerified: 'all' | 'true' | 'false'
  onIsVerifiedChange: (value: 'all' | 'true' | 'false') => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function UserFiltersToolbar({
  searchInput,
  onSearchInputChange,
  planType,
  onPlanTypeChange,
  isVerified,
  onIsVerifiedChange,
  hasActiveFilters,
  onClearFilters,
}: UserFiltersToolbarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Filter className="h-3.5 w-3.5" />
        Filtros
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Búsqueda por nombre / email */}
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

        {/* Plan */}
        <select
          value={planType}
          onChange={(e) => onPlanTypeChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Todos los planes</option>
          {Object.values(UserPlanType).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Verificación */}
        <select
          value={isVerified}
          onChange={(e) => onIsVerifiedChange(e.target.value as 'all' | 'true' | 'false')}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">Todos los estados</option>
          <option value="true">Verificados</option>
          <option value="false">Sin verificar</option>
        </select>

        {/* Limpiar filtros */}
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
