import { Search, X, Filter } from 'lucide-react'
import { TRACK_LANGUAGE_FILTERS } from '@/src/domains/tracks/data/track-language-filters.data'
import type { AdminGenreDto } from '@/src/domains/admin/types/admin.types'

type Availability = 'all' | 'true' | 'false'

interface TrackFiltersToolbarProps {
  titleInput: string
  onTitleInputChange: (value: string) => void
  genres: AdminGenreDto[]
  genreId: string
  onGenreIdChange: (value: string) => void
  subGenreOptions: string[]
  subGenre: string
  onSubGenreChange: (value: string) => void
  language: string
  onLanguageChange: (value: string) => void
  isAvailable: Availability
  onIsAvailableChange: (value: Availability) => void
  isGospel: Availability
  onIsGospelChange: (value: Availability) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function TrackFiltersToolbar({
  titleInput,
  onTitleInputChange,
  genres,
  genreId,
  onGenreIdChange,
  subGenreOptions,
  subGenre,
  onSubGenreChange,
  language,
  onLanguageChange,
  isAvailable,
  onIsAvailableChange,
  isGospel,
  onIsGospelChange,
  hasActiveFilters,
  onClearFilters,
}: TrackFiltersToolbarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Filter className="h-3.5 w-3.5" />
        Filtros
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Búsqueda por título */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={titleInput}
            onChange={(e) => onTitleInputChange(e.target.value)}
            placeholder="Buscar por título…"
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {titleInput && (
            <button
              onClick={() => onTitleInputChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Género */}
        <select
          value={genreId}
          onChange={(e) => onGenreIdChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Todos los géneros</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.genre}</option>
          ))}
        </select>

        {/* Subgénero — solo visible si hay un género seleccionado con subgéneros */}
        {genreId && subGenreOptions.length > 0 && (
          <select
            value={subGenre}
            onChange={(e) => onSubGenreChange(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos los subgéneros</option>
            {subGenreOptions.map((sg) => (
              <option key={sg} value={sg}>{sg}</option>
            ))}
          </select>
        )}

        {/* Idioma */}
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Todos los idiomas</option>
          {TRACK_LANGUAGE_FILTERS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>

        {/* Disponibilidad */}
        <select
          value={isAvailable}
          onChange={(e) => onIsAvailableChange(e.target.value as Availability)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">Todas las disponibilidades</option>
          <option value="true">Disponibles</option>
          <option value="false">No disponibles</option>
        </select>

        {/* Gospel */}
        <select
          value={isGospel}
          onChange={(e) => onIsGospelChange(e.target.value as Availability)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">Gospel y no-gospel</option>
          <option value="true">Solo gospel</option>
          <option value="false">Solo no-gospel</option>
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
