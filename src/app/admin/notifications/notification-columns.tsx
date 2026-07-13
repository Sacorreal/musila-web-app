import { Trash2 } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminNotificationDto } from '@/src/domains/admin/notifications/admin-notifications.types'

interface NotificationColumnsOptions {
  onDelete: (row: AdminNotificationDto) => void
}

export function getNotificationColumns({ onDelete }: NotificationColumnsOptions): ColumnDef<AdminNotificationDto>[] {
  return [
    {
      key: 'title',
      header: 'Notificación',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.title}</p>
          <p className="truncate text-xs text-muted-foreground">{row.message}</p>
        </div>
      ),
    },
    {
      key: 'recipient',
      header: 'Destinatario',
      width: '2fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.recipient ? `${row.recipient.name} ${row.recipient.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      width: '100px',
      render: (row) => <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{row.type}</span>,
    },
    {
      key: 'isRead',
      header: 'Leída',
      width: '80px',
      render: (row) => (
        <span className={`text-xs font-medium ${row.isRead ? 'text-emerald-600' : 'text-muted-foreground'}`}>
          {row.isRead ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '48px',
      render: (row) => (
        <button
          onClick={() => onDelete(row)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Eliminar notificación"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]
}
