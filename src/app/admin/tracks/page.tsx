'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { Trash2, Music, Play, Pause, Search, X, Filter } from 'lucide-react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import type { AdminTrackDto, TrackFilters } from '@/src/domains/admin/types/admin.types'
import { usePlayerStore } from '@/src/domains/player/store/use-player-store'
import type { TrackResponse } from '@/src/domains/tracks/types/track.types'

function toTrackForPlayer(t: AdminTrackDto): TrackResponse {
  return {
    id: t.id,
    title: t.title,
    genre: t.genre,
    subGenre: t.subGenre ?? '',
    coverUrl: t.coverUrl ?? '',
    audioUrl: t.audioUrl ?? null,
    year: 0,
    audioKey: '',
    language: t.language,
    lyric: '',
    externalsIds: null,
    isAvailable: t.isAvailable,
    isGospel: t.isGospel,
    coverKey: null,
    intellectualProperties: [],
    playlists: [],
    requestedTrack: [],
    createdAt: t.createdAt,
    updatedAt: t.createdAt,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authors: t.authors.map((a) => ({ id: a.id, name: a.name, lastName: a.lastName, email: '', role: '' as any })),
  }
}

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
  { value: 'pt', label: 'Portugués' },
  { value: 'fr', label: 'Francés' },
  { value: 'it', label: 'Italiano' },
]

function useDebounce<T>(value: T, ms = 400): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

export default function AdminTracksPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  // Filtros locales
  const [titleInput, setTitleInput] = useState('')
  const [language, setLanguage] = useState('')
  const [isAvailable, setIsAvailable] = useState<'all' | 'true' | 'false'>('all')
  const [isGospel, setIsGospel] = useState<'all' | 'true' | 'false'>('all')
  const [genreId, setGenreId] = useState('')
  const [subGenre, setSubGenre] = useState('')

  const debouncedTitle = useDebounce(titleInput, 400)

  // Cargar todos los géneros para los selectores (límite alto para traerlos todos)
  const { data: genresData } = adminHooks.useAdminGenres(1, 200)
  const genres = genresData?.data ?? []

  // Subgéneros del género seleccionado
  const subGenreOptions = useMemo(() => {
    if (!genreId) return []
    return genres.find((g) => g.id === genreId)?.subGenre ?? []
  }, [genreId, genres])

  const filters: TrackFilters = {
    ...(debouncedTitle && { title: debouncedTitle }),
    ...(language && { language }),
    ...(isAvailable !== 'all' && { isAvailable: isAvailable === 'true' }),
    ...(isGospel !== 'all' && { isGospel: isGospel === 'true' }),
    ...(genreId && { genreId }),
    ...(subGenre && { subGenre }),
  }

  const hasActiveFilters =
    !!debouncedTitle || !!language || isAvailable !== 'all' || isGospel !== 'all' || !!genreId || !!subGenre

  const resetFilters = useCallback(() => {
    setTitleInput('')
    setLanguage('')
    setIsAvailable('all')
    setIsGospel('all')
    setGenreId('')
    setSubGenre('')
    setPage(1)
  }, [])

  // Resetear página al cambiar filtros
  useEffect(() => { setPage(1) }, [debouncedTitle, language, isAvailable, isGospel, genreId, subGenre])

  // Resetear subgénero al cambiar género
  useEffect(() => { setSubGenre('') }, [genreId])

  const { data, isLoading, error } = adminHooks.useAdminTracks(page, limit, filters)
  const { mutate: deleteTrack, isPending: isDeleting } = adminHooks.useDeleteTrack()
  const [deleteTarget, setDeleteTarget] = useState<AdminTrackDto | null>(null)

  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const isPlaying = usePlayerStore((s) => s.isPlaying)

  const columns: ColumnDef<AdminTrackDto>[] = [
    {
      key: 'cover',
      header: 'Cover',
      width: '56px',
      render: (row) => {
        const isActive = currentTrack?.id === row.id
        const showPause = isActive && isPlaying

        return (
          <button
            onClick={() => {
              if (isActive && isPlaying) {
                usePlayerStore.getState().pause()
              } else if (isActive && !isPlaying) {
                usePlayerStore.getState().resume()
              } else {
                usePlayerStore.getState().play(toTrackForPlayer(row))
              }
            }}
            className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={showPause ? `Pausar ${row.title}` : `Reproducir ${row.title}`}
          >
            {row.coverUrl ? (
              <Image
                src={row.coverUrl}
                alt={row.title}
                fill
                sizes="40px"
                className={`object-cover transition-all duration-200 ${isActive ? 'brightness-50' : 'group-hover:brightness-50'}`}
              />
            ) : (
              <div className={`flex h-full w-full items-center justify-center bg-muted transition-colors ${isActive ? 'bg-muted/60' : 'group-hover:bg-muted/60'}`}>
                <Music className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              {showPause ? (
                <Pause className="h-4 w-4 text-white drop-shadow" />
              ) : (
                <Play className="h-4 w-4 translate-x-0.5 text-white drop-shadow" />
              )}
            </span>
            {isActive && (
              <span className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-primary ring-offset-1 ring-offset-card" />
            )}
          </button>
        )
      },
    },
    {
      key: 'title',
      header: 'Título',
      width: '2fr',
      render: (row) => {
        const isActive = currentTrack?.id === row.id
        return (
          <div className="min-w-0">
            <p className={`truncate text-sm font-semibold ${isActive ? 'text-primary' : ''}`}>{row.title}</p>
            <p className="truncate text-xs text-muted-foreground">{row.language}</p>
          </div>
        )
      },
    },
    {
      key: 'genre',
      header: 'Género',
      width: '1fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{row.genre || '—'}</p>
          {row.subGenre && (
            <p className="truncate text-[11px] text-muted-foreground/60">{row.subGenre}</p>
          )}
        </div>
      ),
    },
    {
      key: 'authors',
      header: 'Autores',
      width: '1fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground truncate">
          {row.authors?.map((a) => `${a.name} ${a.lastName}`).join(', ') || '—'}
        </span>
      ),
    },
    {
      key: 'available',
      header: 'Público',
      width: '80px',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.isAvailable ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
          {row.isAvailable ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      width: '100px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '48px',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setDeleteTarget(row)
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Eliminar ${row.title}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight">Tracks</h2>
        <p className="text-sm text-muted-foreground">{data?.total ?? '—'} tracks en el sistema</p>
      </div>

      {/* Barra de filtros */}
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
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Buscar por título…"
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {titleInput && (
              <button
                onClick={() => setTitleInput('')}
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
            onChange={(e) => setGenreId(e.target.value)}
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
              onChange={(e) => setSubGenre(e.target.value)}
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
            onChange={(e) => setLanguage(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos los idiomas</option>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          {/* Disponibilidad */}
          <select
            value={isAvailable}
            onChange={(e) => setIsAvailable(e.target.value as 'all' | 'true' | 'false')}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="all">Todas las disponibilidades</option>
            <option value="true">Disponibles</option>
            <option value="false">No disponibles</option>
          </select>

          {/* Gospel */}
          <select
            value={isGospel}
            onChange={(e) => setIsGospel(e.target.value as 'all' | 'true' | 'false')}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="all">Gospel y no-gospel</option>
            <option value="true">Solo gospel</option>
            <option value="false">Solo no-gospel</option>
          </select>

          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los tracks' : null}
        emptyMessage={hasActiveFilters ? 'No se encontraron tracks con esos filtros' : 'No hay tracks registrados'}
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteTrack(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={isDeleting}
        title="¿Eliminar track?"
        description={`Se eliminará "${deleteTarget?.title}" del sistema. Las solicitudes de licencia asociadas también se verán afectadas.`}
      />
    </div>
  )
}
