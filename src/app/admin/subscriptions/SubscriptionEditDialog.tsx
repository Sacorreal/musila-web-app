'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { adminPlansHooks } from '@/src/domains/admin/plans/plans.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Field, FieldLabel } from '@/src/shared/components/UI/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select'
import type { SubscriptionDto } from '@/src/domains/admin/plans/plans.types'

interface SubscriptionEditDialogProps {
  subscription: SubscriptionDto | null
  onClose: () => void
}

/** Cambio manual de plan/estado de una subscription (queda auditado en backend). */
export function SubscriptionEditDialog({ subscription, onClose }: SubscriptionEditDialogProps) {
  const { data: plans } = adminPlansHooks.usePlans()
  const { mutate: updateSubscription, isPending } = adminPlansHooks.useUpdateSubscription()

  const [planId, setPlanId] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (subscription) {
      setPlanId(subscription.planId)
      setStatus(subscription.status)
    }
  }, [subscription])

  const compatiblePlans = (plans ?? []).filter(
    (plan) => plan.subjectType === subscription?.subjectType,
  )

  return (
    <Dialog open={!!subscription} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar subscription</DialogTitle>
          <DialogDescription>
            Cambio manual de plan o estado. La operación queda registrada en la auditoría y el motor
            de autorización se actualiza al instante.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field>
            <FieldLabel>Plan</FieldLabel>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el plan" />
              </SelectTrigger>
              <SelectContent>
                {compatiblePlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} ({plan.key})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Estado</FieldLabel>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Activa</SelectItem>
                <SelectItem value="PAST_DUE">En mora</SelectItem>
                <SelectItem value="CANCELED">Cancelada</SelectItem>
                <SelectItem value="EXPIRED">Vencida</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            className="gap-2"
            disabled={isPending || !planId}
            onClick={() =>
              subscription &&
              updateSubscription(
                { id: subscription.id, input: { planId, status } },
                { onSuccess: onClose },
              )
            }
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
