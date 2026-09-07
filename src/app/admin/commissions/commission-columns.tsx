import { CheckCircle2, XCircle } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminCommissionDto } from '@/src/domains/admin/commissions/admin-commissions.types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

interface CommissionColumnsOptions {
  onPay: (row: AdminCommissionDto) => void
  onReject: (rowId: string) => void
}

export function getCommissionColumns({ onPay, onReject }: CommissionColumnsOptions): ColumnDef<AdminCommissionDto>[] {
  return [
    {
      key: 'affiliate',
      header: 'Afiliado',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {row.affiliate ? `${row.affiliate.name} ${row.affiliate.lastName}` : row.affiliateId}
          </p>
          {row.affiliate && <p className="truncate text-xs text-muted-foreground">{row.affiliate.email}</p>}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.commissionType === 'first_purchase' ? 'Primera compra' : 'Recurrente'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Comisión',
      width: '140px',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold">{currencyFormatter.format(row.commissionAmount)}</p>
          <p className="text-xs text-muted-foreground">de {currencyFormatter.format(row.saleAmount)}</p>
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
    {
      key: 'actions',
      header: 'Acciones',
      width: '90px',
      render: (row) => {
        if (row.status !== 'pending' && row.status !== 'approved') return null
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPay(row)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-600"
              aria-label="Marcar como pagada"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onReject(row.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Rechazar comisión"
            >
              <XCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      },
    },
  ]
}
