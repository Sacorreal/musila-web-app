import Image from 'next/image'
import { Pencil, Trash2, User } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { BlogAuthorDto } from '@/src/domains/blog/shared/blog.types'

interface AuthorColumnsOptions {
  onEdit: (row: BlogAuthorDto) => void
  onDelete: (row: BlogAuthorDto) => void
}

export function getAuthorColumns({ onEdit, onDelete }: AuthorColumnsOptions): ColumnDef<BlogAuthorDto>[] {
  return [
    {
      key: 'avatar',
      header: '',
      width: '56px',
      render: (row) => (
        <div className="relative h-9 w-9 overflow-hidden rounded-full bg-muted">
          {row.avatarUrl ? (
            <Image src={row.avatarUrl} alt={row.name} fill sizes="36px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Autor',
      width: '2fr',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.role}</p>
        </div>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      width: '1.5fr',
      render: (row) => <span className="text-xs text-muted-foreground">/blog/authors/{row.slug}</span>,
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
