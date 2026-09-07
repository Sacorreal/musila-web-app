import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminChatDto } from '@/src/domains/admin/readonly/chat/admin-chat.types'

export function getChatColumns(): ColumnDef<AdminChatDto>[] {
  return [
    {
      key: 'track',
      header: 'Track',
      width: '2fr',
      render: (row) => <p className="truncate text-sm font-semibold">{row.request?.track?.title ?? '—'}</p>,
    },
    {
      key: 'requester',
      header: 'Solicitante',
      width: '1.5fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.request?.requester ? `${row.request.requester.name} ${row.request.requester.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'owner',
      header: 'Propietario',
      width: '1.5fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.request?.owner ? `${row.request.owner.name} ${row.request.owner.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'guests',
      header: 'Invitados',
      width: '90px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.guests?.length ?? 0}</span>,
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
      header: '',
      width: '90px',
      render: (row) => (
        <Link href={`/admin/chat/${row.id}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
          <MessageSquare className="h-3 w-3" />
          Ver
        </Link>
      ),
    },
  ]
}
