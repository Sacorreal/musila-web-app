import { Trash2, Link2 } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminInviteDto } from '@/src/domains/admin/invites/admin-invites.types'

interface InviteColumnsOptions {
  onRevoke: (row: AdminInviteDto) => void
}

function isExpired(invite: AdminInviteDto) {
  return new Date(invite.expiresAt) < new Date()
}

export function getInviteColumns({ onRevoke }: InviteColumnsOptions): ColumnDef<AdminInviteDto>[] {
  return [
    {
      key: 'email',
      header: 'Destinatario',
      width: '2fr',
      render: (row) => <span className="text-sm font-medium">{row.email ?? '—'}</span>,
    },
    {
      key: 'invitedBy',
      header: 'Invitado por',
      width: '2fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.invitedBy ? `${row.invitedBy.name} ${row.invitedBy.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '110px',
      render: (row) => {
        const label = row.isUsed ? 'Usada' : isExpired(row) ? 'Expirada' : 'Pendiente'
        const color = row.isUsed
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          : isExpired(row)
            ? 'bg-muted text-muted-foreground'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>{label}</span>
      },
    },
    {
      key: 'token',
      header: 'Token',
      width: '90px',
      render: (row) => (
        <button
          onClick={() => {
            navigator.clipboard.writeText(row.token)
            toast.success('Token copiado')
          }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link2 className="h-3 w-3" />
          Copiar
        </button>
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
      header: '',
      width: '48px',
      render: (row) => (
        <button
          onClick={() => onRevoke(row)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Revocar invitación"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]
}
