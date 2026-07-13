import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Pencil, Music, Play, Pause } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminTrackDto } from '@/src/domains/admin/types/admin.types'

interface TrackColumnsOptions {
  currentTrackId?: string
  isPlaying: boolean
  onTogglePlay: (row: AdminTrackDto) => void
  onDelete: (row: AdminTrackDto) => void
}

export function getTrackColumns({
  currentTrackId,
  isPlaying,
  onTogglePlay,
  onDelete,
}: TrackColumnsOptions): ColumnDef<AdminTrackDto>[] {
  return [
    {
      key: 'cover',
      header: 'Cover',
      width: '56px',
      render: (row) => {
        const isActive = currentTrackId === row.id
        const showPause = isActive && isPlaying

        return (
          <button
            onClick={() => onTogglePlay(row)}
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
        const isActive = currentTrackId === row.id
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
      width: '80px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/tracks/${row.id}/editar`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar ${row.title}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(row)
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Eliminar ${row.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]
}
