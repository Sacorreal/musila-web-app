import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { BlogArticleDto } from '@/src/domains/blog/shared/blog.types'

interface ArticleColumnsOptions {
  onEdit: (row: BlogArticleDto) => void
  onDelete: (row: BlogArticleDto) => void
  onTogglePublish: (row: BlogArticleDto) => void
}

export function getArticleColumns({ onEdit, onDelete, onTogglePublish }: ArticleColumnsOptions): ColumnDef<BlogArticleDto>[] {
  return [
    {
      key: 'title',
      header: 'Artículo',
      width: '2.5fr',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold">{row.title}</p>
          <p className="text-xs text-muted-foreground">{row.authors.map((a) => a.name).join(', ')}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '110px',
      render: (row) => (
        <span
          className={
            row.status === 'published'
              ? 'inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400'
              : 'inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground'
          }
        >
          {row.status === 'published' ? 'Publicado' : 'Borrador'}
        </span>
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
      width: '120px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTogglePublish(row)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={row.status === 'published' ? `Pasar a borrador ${row.title}` : `Publicar ${row.title}`}
          >
            {row.status === 'published' ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => onEdit(row)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar ${row.title}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Eliminar ${row.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]
}
