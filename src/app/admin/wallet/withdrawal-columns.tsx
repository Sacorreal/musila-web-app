import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import type { ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import type { AdminWalletWithdrawalDto } from '@/src/domains/admin/wallet/admin-wallet.types'
import { WalletWithdrawalStatus } from '@/src/domains/wallet/types/wallet.types'

const STATUS_COLORS: Record<WalletWithdrawalStatus, string> = {
  [WalletWithdrawalStatus.PENDING]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  [WalletWithdrawalStatus.IN_PROCESS]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [WalletWithdrawalStatus.PAID]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  [WalletWithdrawalStatus.REJECTED]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const STATUS_LABELS: Record<WalletWithdrawalStatus, string> = {
  [WalletWithdrawalStatus.PENDING]: 'Pendiente',
  [WalletWithdrawalStatus.IN_PROCESS]: 'En proceso',
  [WalletWithdrawalStatus.PAID]: 'Pagado',
  [WalletWithdrawalStatus.REJECTED]: 'Rechazado',
}

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

interface WithdrawalColumnsOptions {
  onProcess: (row: AdminWalletWithdrawalDto) => void
  onPay: (row: AdminWalletWithdrawalDto) => void
  onReject: (rowId: string) => void
}

export function getWithdrawalColumns({ onProcess, onPay, onReject }: WithdrawalColumnsOptions): ColumnDef<AdminWalletWithdrawalDto>[] {
  return [
    {
      key: 'user',
      header: 'Usuario',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.user.name} {row.user.lastName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.user.email}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Monto',
      width: '130px',
      render: (row) => <p className="text-sm font-semibold">{currencyFormatter.format(row.amount)}</p>,
    },
    {
      key: 'bankAccount',
      header: 'Cuenta bancaria',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0 text-xs text-muted-foreground">
          <p className="truncate">{row.bankAccountSnapshot.bankName} · {row.bankAccountSnapshot.accountType}</p>
          <p className="truncate">{row.bankAccountSnapshot.accountHolderName} — {row.bankAccountSnapshot.accountNumber}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '110px',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[row.status]}`}>
          {STATUS_LABELS[row.status]}
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
      width: '120px',
      render: (row) => {
        if (row.status === WalletWithdrawalStatus.PAID || row.status === WalletWithdrawalStatus.REJECTED) return null
        return (
          <div className="flex items-center gap-1">
            {row.status === WalletWithdrawalStatus.PENDING && (
              <button
                onClick={() => onProcess(row)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-blue-500/10 hover:text-blue-600"
                aria-label="Marcar en proceso"
                title="Marcar en proceso"
              >
                <Clock className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => onPay(row)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-600"
              aria-label="Marcar como pagado"
              title="Marcar como pagado"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onReject(row.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Rechazar retiro"
              title="Rechazar retiro"
            >
              <XCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      },
    },
  ]
}
