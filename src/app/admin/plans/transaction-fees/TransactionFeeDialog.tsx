'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { adminTransactionFeesHooks } from '@/src/domains/admin/transaction-fees/transaction-fees.hooks'
import type { TransactionFeeView } from '@/src/domains/admin/transaction-fees/transaction-fees.types'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldLabel } from '@/src/shared/components/UI/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'

interface TransactionFeeDialogProps {
  fee: TransactionFeeView | null
  onClose: () => void
}

/** Edición de la comisión de un plan para un tipo de organización (§7). */
export function TransactionFeeDialog({ fee, onClose }: TransactionFeeDialogProps) {
  const { mutate: update, isPending } = adminTransactionFeesHooks.useUpdateTransactionFee()
  const [rate, setRate] = useState('')

  useEffect(() => {
    if (fee) setRate(fee.rate !== null ? String(fee.rate) : '')
  }, [fee])

  const isOpen = !!fee
  const parsed = Number(rate)
  const isValid = rate.trim() !== '' && !Number.isNaN(parsed) && parsed >= 0 && parsed <= 100

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {fee?.planName} · {fee?.organizationType}
          </DialogTitle>
          <DialogDescription>
            Comisión del entitlement{' '}
            <span className="font-mono">{fee?.entitlementKey}</span> que paga el comprador sobre el
            valor de la licencia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Comisión actual</span>
            <span className="font-bold">{fee?.rate !== null ? `${fee?.rate}%` : 'Sin configurar'}</span>
          </div>

          <Field>
            <FieldLabel htmlFor="fee-rate">Nueva comisión (%)</FieldLabel>
            <Input
              id="fee-rate"
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={rate}
              onChange={(event) => setRate(event.target.value)}
              placeholder="Ej. 7.5"
            />
          </Field>

          <div className="flex gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Esta modificación aplicará únicamente a nuevas operaciones. Las operaciones que ya
              tengan una comisión congelada no serán modificadas.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            className="gap-2"
            disabled={isPending || !isValid}
            onClick={() =>
              fee &&
              update(
                { planId: fee.planId, input: { organizationType: fee.organizationType, rate: parsed } },
                { onSuccess: onClose },
              )
            }
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
