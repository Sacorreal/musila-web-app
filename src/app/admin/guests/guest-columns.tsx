import { Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminGuestDto } from '@/src/domains/admin/guests/admin-guests.types'

interface GuestColumnsOptions {
  onEdit: (row: AdminGuestDto) => void
  onDelete: (row: AdminGuestDto) => void
}

export function getGuestColumns({ onEdit, onDelete }: GuestColumnsOptions): ColumnDef<AdminGuestDto>[] {
  return [
    {
      key: 'name',
      header: 'Invitado',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.name} {row.lastName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'invitedBy',
      header: 'Invitado por',
      width: '2fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.invited_by ? `${row.invited_by.name} ${row.invited_by.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'verified',
      header: 'Verificado',
      width: '100px',
      render: (row) => (
        <span className={`text-xs font-medium ${row.isVerified ? 'text-emerald-600' : 'text-muted-foreground'}`}>
          {row.isVerified ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registro',
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
            aria-label={`Editar ${row.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Eliminar ${row.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]
}
