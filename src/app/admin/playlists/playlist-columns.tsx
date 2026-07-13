import Link from 'next/link'
import { Pencil, Trash2, Users } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminPlaylistDto } from '@/src/domains/admin/playlists/admin-playlists.types'

interface PlaylistColumnsOptions {
  onEdit: (row: AdminPlaylistDto) => void
  onDelete: (row: AdminPlaylistDto) => void
}

export function getPlaylistColumns({ onEdit, onDelete }: PlaylistColumnsOptions): ColumnDef<AdminPlaylistDto>[] {
  return [
    {
      key: 'title',
      header: 'Playlist',
      width: '2fr',
      render: (row) => <p className="text-sm font-semibold truncate">{row.title}</p>,
    },
    {
      key: 'owner',
      header: 'Propietario',
      width: '2fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground truncate">
          {row.owner ? `${row.owner.name} ${row.owner.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'tracks',
      header: 'Tracks',
      width: '80px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.tracks?.length ?? 0}</span>,
    },
    {
      key: 'collaborators',
      header: 'Colaboradores',
      width: '110px',
      render: (row) => (
        <Link
          href={`/admin/playlists/${row.id}`}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Users className="h-3 w-3" />
          {row.collaborators?.length ?? 0}
        </Link>
      ),
    },
    {
      key: 'createdAt',
      header: 'Creada',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '80px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar ${row.title}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(row)}
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
