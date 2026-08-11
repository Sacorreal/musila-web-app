'use client'

import { Loader2 } from 'lucide-react'
import { adminTransactionFeesHooks } from '@/src/domains/admin/transaction-fees/transaction-fees.hooks'
import type { TransactionFeeView } from '@/src/domains/admin/transaction-fees/transaction-fees.types'
import { Badge } from '@/src/shared/components/UI/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'

interface TransactionFeeHistoryDialogProps {
  target: TransactionFeeView | null
  onClose: () => void
}

const fmtDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

/** Historial de vigencia de la comisión, con quién y cuándo la cambió (§20/§21). */
export function TransactionFeeHistoryDialog({ target, onClose }: TransactionFeeHistoryDialogProps) {
  const { data, isLoading } = adminTransactionFeesHooks.useTransactionFeeHistory(
    target?.planId ?? null,
    target?.organizationType,
  )

  const isOpen = !!target

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Historial · {target?.planName} · {target?.organizationType}
          </DialogTitle>
          <DialogDescription>
            Cada cambio queda registrado y es inmutable. Los Deals ya formalizados conservan su
            propio porcentaje congelado.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (data?.length ?? 0) === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Sin historial todavía.</p>
        ) : (
          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {data!.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black">{entry.rate}%</span>
                  {entry.isActive && !entry.effectiveUntil && (
                    <Badge variant="default" className="text-[10px]">
                      Vigente
                    </Badge>
                  )}
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>
                    {fmtDate(entry.effectiveFrom)} → {entry.effectiveUntil ? fmtDate(entry.effectiveUntil) : 'vigente'}
                  </p>
                  <p>Por: {entry.changedByName ?? 'Sistema'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
