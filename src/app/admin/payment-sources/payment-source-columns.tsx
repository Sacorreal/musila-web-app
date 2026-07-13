import { CreditCard } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminPaymentSourceDto } from '@/src/domains/admin/readonly/payment-sources/admin-payment-sources.types'

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function getPaymentSourceColumns(): ColumnDef<AdminPaymentSourceDto>[] {
  return [
    {
      key: 'user',
      header: 'Usuario',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.user ? `${row.user.name} ${row.user.lastName}` : '—'}</p>
          <p className="truncate text-xs text-muted-foreground">{row.user?.email}</p>
        </div>
      ),
    },
    {
      key: 'card',
      header: 'Tarjeta',
      width: '150px',
      render: (row) => (
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
          {row.brand ?? '—'} •••• {row.last4 ?? '----'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '110px',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[row.status] ?? 'bg-muted text-foreground'}`}>
          {row.status}
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
  ]
}
