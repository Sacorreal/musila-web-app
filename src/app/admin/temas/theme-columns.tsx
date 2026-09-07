import { Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminThemeDto } from '@/src/domains/admin/types/admin.types'

interface ThemeColumnsOptions {
  onEdit: (row: AdminThemeDto) => void
  onDelete: (row: AdminThemeDto) => void
}

export function getThemeColumns({ onEdit, onDelete }: ThemeColumnsOptions): ColumnDef<AdminThemeDto>[] {
  return [
    {
      key: 'name',
      header: 'Tema',
      width: '3fr',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold">{row.name}</p>
          {row.slug && <p className="text-xs text-muted-foreground">{row.slug}</p>}
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
            aria-label={`Editar ${row.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Eliminar ${row.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]
}
