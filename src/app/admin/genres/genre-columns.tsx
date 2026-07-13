import { Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminGenreDto } from '@/src/domains/admin/types/admin.types'

interface GenreColumnsOptions {
  onEdit: (row: AdminGenreDto) => void
  onDelete: (row: AdminGenreDto) => void
}

export function getGenreColumns({ onEdit, onDelete }: GenreColumnsOptions): ColumnDef<AdminGenreDto>[] {
  return [
    {
      key: 'genre',
      header: 'Género',
      width: '2fr',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold">{row.genre}</p>
          {row.slug && <p className="text-xs text-muted-foreground">{row.slug}</p>}
        </div>
      ),
    },
    {
      key: 'subGenres',
      header: 'Subgéneros',
      width: '3fr',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.subGenre?.slice(0, 4).map((sg) => (
            <span key={sg} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {sg}
            </span>
          ))}
          {(row.subGenre?.length ?? 0) > 4 && (
            <span className="text-xs text-muted-foreground">+{row.subGenre.length - 4}</span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Creado',
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
      width: '90px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(row)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar ${row.genre}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Eliminar ${row.genre}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]
}
