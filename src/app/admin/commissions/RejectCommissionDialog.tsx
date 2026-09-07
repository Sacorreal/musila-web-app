'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { adminCommissionsHooks } from '@/src/domains/admin/commissions/admin-commissions.hooks'
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
  commissionId: string | null
  onClose: () => void
}

export function RejectCommissionDialog({ commissionId, onClose }: Props) {
  const [reason, setReason] = useState('')
  const { mutate: rejectCommission, isPending } = adminCommissionsHooks.useRejectCommission()

  const handleClose = () => {
    setReason('')
    onClose()
  }

  return (
    <Dialog open={!!commissionId} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rechazar comisión</DialogTitle>
          <DialogDescription>Indica el motivo del rechazo. El afiliado no recibirá el pago.</DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel>Motivo</FieldLabel>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Pago original reembolsado por el cliente"
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
              if (!commissionId) return
              rejectCommission({ id: commissionId, reason: reason.trim() }, { onSuccess: handleClose })
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rechazando...
              </>
            ) : (
              'Rechazar Comisión'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
