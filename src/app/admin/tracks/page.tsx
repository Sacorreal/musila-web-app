'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { useDebouncedSearch } from '@/src/domains/admin/shared/useDebouncedSearch'
import type { AdminTrackDto, TrackFilters } from '@/src/domains/admin/types/admin.types'
import { usePlayerStore } from '@/src/domains/player/store/use-player-store'
import { toTrackForPlayer } from '@/src/domains/tracks/utils/track-adapters'
import { getTrackColumns } from './track-columns'
import { TrackFiltersToolbar } from './track-filters-toolbar'

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

  const debouncedTitle = useDebouncedSearch(titleInput, 400)

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

  const columns = getTrackColumns({
    currentTrackId: currentTrack?.id,
    isPlaying,
    onTogglePlay: (row) => {
      const isActive = currentTrack?.id === row.id
      if (isActive && isPlaying) {
        usePlayerStore.getState().pause()
      } else if (isActive && !isPlaying) {
        usePlayerStore.getState().resume()
      } else {
        usePlayerStore.getState().play(toTrackForPlayer(row))
      }
    },
    onDelete: setDeleteTarget,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tracks"
        description={`${data?.total ?? '—'} tracks en el sistema`}
        actions={
          <Link href="/admin/tracks/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Track
            </Button>
          </Link>
        }
      />

      <TrackFiltersToolbar
        titleInput={titleInput}
        onTitleInputChange={setTitleInput}
        genres={genres}
        genreId={genreId}
        onGenreIdChange={setGenreId}
        subGenreOptions={subGenreOptions}
        subGenre={subGenre}
        onSubGenreChange={setSubGenre}
        language={language}
        onLanguageChange={setLanguage}
        isAvailable={isAvailable}
        onIsAvailableChange={setIsAvailable}
        isGospel={isGospel}
        onIsGospelChange={setIsGospel}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={resetFilters}
      />

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
