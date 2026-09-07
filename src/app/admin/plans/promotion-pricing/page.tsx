'use client'

import { useEffect, useState } from 'react'
import { Megaphone, Pencil } from 'lucide-react'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import { adminPromotionPricingHooks } from '@/src/domains/admin/promotion-pricing/promotion-pricing.hooks'
import type {
  PromotionPricingItem,
  PromotionType,
} from '@/src/domains/promotions/types/promotions.types'
import { formatCOP } from '@/src/domains/promotions/utils/promotion-format'

const TYPE_LABEL: Record<PromotionType, string> = {
  TRACK: 'Track destacado',
  COMPOSER: 'Compositor destacado',
}

export default function AdminPromotionPricingPage() {
  const { data, isLoading, error } = adminPromotionPricingHooks.usePromotionPricingAdmin()
  const update = adminPromotionPricingHooks.useUpdatePromotionPrice()

  const [editTarget, setEditTarget] = useState<PromotionPricingItem | null>(null)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (editTarget) setAmount(String(Number(editTarget.amount)))
  }, [editTarget])

  const submit = () => {
    if (!editTarget) return
    const value = Number(amount)
    if (Number.isNaN(value) || value < 0) return
    update.mutate(
      { type: editTarget.type, amount: value },
      { onSuccess: () => setEditTarget(null) },
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Precios de Pautas"
        description="Define el valor de cada tipo de pauta (track y compositor). El cambio queda versionado y aplica solo a nuevas pautas; las existentes conservan su precio."
      />

      {isLoading ? (
        <LoadingState message="Cargando precios…" />
      ) : error ? (
        <ErrorState message="No se pudieron cargar los precios." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(data ?? []).map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Megaphone className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{TYPE_LABEL[item.type]}</p>
                    <p className="text-2xl font-semibold">{formatCOP(Number(item.amount))}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setEditTarget(item)}>
                  <Pencil className="mr-1 h-4 w-4" aria-hidden /> Editar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editar precio · {editTarget ? TYPE_LABEL[editTarget.type] : ''}
            </DialogTitle>
            <DialogDescription>
              Nuevo valor en pesos colombianos (COP). Aplica solo a nuevas pautas.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="number"
            min={0}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label="Nuevo precio en COP"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Cancelar
            </Button>
            <Button onClick={submit} disabled={update.isPending}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
