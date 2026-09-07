'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { adminWalletHooks } from '@/src/domains/admin/wallet/admin-wallet.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { Field, FieldLabel } from '@/src/shared/components/UI/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog'

interface Props {
  withdrawalId: string | null
  onClose: () => void
}

export function RejectWithdrawalDialog({ withdrawalId, onClose }: Props) {
  const [reason, setReason] = useState('')
  const { mutate: rejectWithdrawal, isPending } = adminWalletHooks.useRejectWithdrawal()

  const handleClose = () => {
    setReason('')
    onClose()
  }

  return (
    <Dialog open={!!withdrawalId} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rechazar solicitud de retiro</DialogTitle>
          <DialogDescription>Indica el motivo del rechazo. Se notificará al usuario.</DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel>Motivo</FieldLabel>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: La cuenta bancaria informada no es válida"
            rows={3}
          />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={isPending || !reason.trim()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              if (!withdrawalId) return
              rejectWithdrawal({ id: withdrawalId, reason: reason.trim() }, { onSuccess: handleClose })
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rechazando...
              </>
            ) : (
              'Rechazar retiro'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
