import { Pencil, Trash2, Link as LinkIcon } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { RELATED_SERVICE_ICONS } from '@/src/domains/blog/tags/components/RelatedServicesSection'
import type { BlogTagDto } from '@/src/domains/blog/shared/blog.types'

interface TagColumnsOptions {
  onEdit: (row: BlogTagDto) => void
  onDelete: (row: BlogTagDto) => void
}

export function getTagColumns({ onEdit, onDelete }: TagColumnsOptions): ColumnDef<BlogTagDto>[] {
  return [
    {
      key: 'icon',
      header: 'Ícono',
      width: '70px',
      render: (row) => {
        const Icon = RELATED_SERVICE_ICONS[row.icon] ?? LinkIcon
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )
      },
    },
    {
      key: 'name',
      header: 'Servicio',
      width: '2fr',
      render: (row) => <p className="text-sm font-semibold">{row.name}</p>,
    },
    {
      key: 'url',
      header: 'URL',
      width: '2fr',
      render: (row) => <span className="truncate text-xs text-muted-foreground">{row.url}</span>,
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
