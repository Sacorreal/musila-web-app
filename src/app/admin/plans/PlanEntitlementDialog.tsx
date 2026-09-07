'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { adminPlansHooks } from '@/src/domains/admin/plans/plans.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Switch } from '@/src/shared/components/UI/switch'
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
import type {
  EntitlementPeriod,
  PlanDto,
  PlanEntitlementDto,
} from '@/src/domains/admin/plans/plans.types'

const PERIODS: { value: EntitlementPeriod; label: string }[] = [
  { value: 'LIFETIME', label: 'De por vida' },
  { value: 'MONTH', label: 'Mensual' },
  { value: 'YEAR', label: 'Anual' },
  { value: 'DAY', label: 'Diario' },
  { value: 'BILLING_PERIOD', label: 'Período de facturación' },
  { value: 'NONE', label: 'Sin período' },
]

interface PlanEntitlementDialogProps {
  plan: PlanDto | null
  planEntitlement: PlanEntitlementDto | null
  onClose: () => void
}

/** Edición del valor comercial de un entitlement dentro de un plan (límite/ilimitado/período). */
export function PlanEntitlementDialog({
  plan,
  planEntitlement,
  onClose,
}: PlanEntitlementDialogProps) {
  const { mutate: upsert, isPending } = adminPlansHooks.useUpsertPlanEntitlement()

  const [unlimited, setUnlimited] = useState(false)
  const [limit, setLimit] = useState('0')
  const [period, setPeriod] = useState<EntitlementPeriod>('LIFETIME')

  useEffect(() => {
    if (planEntitlement) {
      setUnlimited(planEntitlement.unlimited)
      setLimit(String(planEntitlement.limit ?? 0))
      setPeriod(planEntitlement.period)
    }
  }, [planEntitlement])

  const isOpen = !!plan && !!planEntitlement

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {planEntitlement?.entitlement.name} · {plan?.name}
          </DialogTitle>
          <DialogDescription>
            Cambia el límite del entitlement{' '}
            <span className="font-mono">{planEntitlement?.entitlement.key}</span> para este plan.
            Sin cuotas hardcoded: el enforcement lo hace el motor con estos datos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
            <span>Ilimitado</span>
            <Switch checked={unlimited} onCheckedChange={setUnlimited} />
          </label>

          {!unlimited && (
            <Field>
              <FieldLabel htmlFor="entitlement-limit">Límite</FieldLabel>
              <Input
                id="entitlement-limit"
                type="number"
                min={0}
                value={limit}
                onChange={(event) => setLimit(event.target.value)}
              />
            </Field>
          )}

          <Field>
            <FieldLabel>Período</FieldLabel>
            <Select value={period} onValueChange={(value) => setPeriod(value as EntitlementPeriod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((entry) => (
                  <SelectItem key={entry.value} value={entry.value}>
                    {entry.label}
                  </SelectItem>
                ))}
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
            disabled={isPending || (!unlimited && Number.isNaN(Number(limit)))}
            onClick={() =>
              plan &&
              planEntitlement &&
              upsert(
                {
                  planId: plan.id,
                  entitlementId: planEntitlement.entitlementId,
                  input: {
                    limit: unlimited ? null : Number(limit),
                    unlimited,
                    period,
                  },
                },
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
