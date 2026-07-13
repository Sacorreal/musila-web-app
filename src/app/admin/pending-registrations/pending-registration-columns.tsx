import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminPendingRegistrationDto } from '@/src/domains/admin/readonly/pending-registrations/admin-pending-registrations.types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  payment_confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  expired: 'bg-muted text-muted-foreground',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function getPendingRegistrationColumns(): ColumnDef<AdminPendingRegistrationDto>[] {
  return [
    {
      key: 'externalReference',
      header: 'Referencia',
      width: '2fr',
      render: (row) => <span className="text-xs font-mono">{row.externalReference}</span>,
    },
    {
      key: 'role',
      header: 'Rol',
      width: '110px',
      render: (row) => <span className="text-xs text-muted-foreground capitalize">{row.role}</span>,
    },
    {
      key: 'plan',
      header: 'Plan',
      width: '90px',
      render: (row) => <span className="text-xs text-muted-foreground uppercase">{row.plan}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      width: '150px',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[row.status] ?? 'bg-muted text-foreground'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      header: 'Expira',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.expiresAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
  ]
}
