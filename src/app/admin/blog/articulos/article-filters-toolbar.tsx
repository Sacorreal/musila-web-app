import { Search, X, Filter } from 'lucide-react'
import type { BlogAuthorDto } from '@/src/domains/blog/shared/blog.types'

type StatusFilter = 'all' | 'draft' | 'published'

interface ArticleFiltersToolbarProps {
  searchInput: string
  onSearchInputChange: (value: string) => void
  authors: BlogAuthorDto[]
  authorId: string
  onAuthorIdChange: (value: string) => void
  status: StatusFilter
  onStatusChange: (value: StatusFilter) => void
  dateFrom: string
  onDateFromChange: (value: string) => void
  dateTo: string
  onDateToChange: (value: string) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function ArticleFiltersToolbar({
  searchInput,
  onSearchInputChange,
  authors,
  authorId,
  onAuthorIdChange,
  status,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  hasActiveFilters,
  onClearFilters,
}: ArticleFiltersToolbarProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        Filtros
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            placeholder="Buscar por título…"
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
          value={authorId}
          onChange={(e) => onAuthorIdChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Todos los autores</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>{author.name}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />

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
