import { Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminRequestDto } from '@/src/domains/admin/types/admin.types'

const STATUS_STYLES: Record<string, string> = {
  pendiente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  aprobada: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rechazada: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  cancelada: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

interface RequestColumnsOptions {
  onEdit: (row: AdminRequestDto) => void
  onDelete: (row: AdminRequestDto) => void
}

export function getRequestColumns({ onEdit, onDelete }: RequestColumnsOptions): ColumnDef<AdminRequestDto>[] {
  return [
    {
      key: 'track',
      header: 'Track',
      width: '2fr',
      render: (row) => (
        <p className="truncate text-sm font-medium">{row.track?.title ?? '—'}</p>
      ),
    },
    {
      key: 'requester',
      header: 'Solicitante',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm">{row.requester ? `${row.requester.name} ${row.requester.lastName}` : '—'}</p>
          <p className="truncate text-xs text-muted-foreground">{row.requester?.email}</p>
        </div>
      ),
    },
    {
      key: 'licenseType',
      header: 'Tipo de licencia',
      width: '2fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground capitalize">{row.licenseType}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '120px',
      render: (row) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[row.status] ?? 'bg-muted text-muted-foreground'}`}>
          {row.status}
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
      header: 'Acciones',
      width: '80px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Editar solicitud"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Eliminar solicitud"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]
}
