import { Filter, X } from 'lucide-react'
import { WalletWithdrawalStatus } from '@/src/domains/wallet/types/wallet.types'

const STATUS_LABELS: Record<WalletWithdrawalStatus, string> = {
  [WalletWithdrawalStatus.PENDING]: 'Pendiente',
  [WalletWithdrawalStatus.IN_PROCESS]: 'En proceso',
  [WalletWithdrawalStatus.PAID]: 'Pagado',
  [WalletWithdrawalStatus.REJECTED]: 'Rechazado',
}

interface WithdrawalFiltersToolbarProps {
  status: string
  onStatusChange: (value: string) => void
  onClearFilters: () => void
}

export function WithdrawalFiltersToolbar({ status, onStatusChange, onClearFilters }: WithdrawalFiltersToolbarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Filter className="h-3.5 w-3.5" />
        Filtros
      </div>
      <div className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Todos los estados</option>
          {Object.values(WalletWithdrawalStatus).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        {status && (
          <button
            onClick={onClearFilters}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
