'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { openWompiWidget } from '@/src/domains/payments/wompi.client'
import {
  useMyPromotions,
  usePromotionCheckout,
  useWithdrawPromotion,
  promotionsHooks,
} from '../hooks/use-promotions.hooks'
import type { PromotionStatus, PromotionView } from '../types/promotions.types'
import {
  ACTIVE_STATUSES,
  CLOSED_STATUSES,
  PENDING_STATUSES,
  PROMOTION_STATUS_LABEL,
  PROMOTION_STATUS_VARIANT,
  formatCOP,
  formatDate,
} from '../utils/promotion-format'

/** Panel “Mis pautas” del publisher: activas, pendientes y caducadas. */
export function MisPautasPanel() {
  const { data, isLoading, isError } = useMyPromotions()

  const grouped = useMemo(() => {
    const list = data ?? []
    const inGroup = (s: PromotionStatus[]) => list.filter((p) => s.includes(p.status))
    return {
      active: inGroup(ACTIVE_STATUSES),
      pending: inGroup(PENDING_STATUSES),
      closed: inGroup(CLOSED_STATUSES),
    }
  }, [data])

  if (isLoading) return <LoadingState message="Cargando tus pautas…" />
  if (isError) return <ErrorState message="No se pudieron cargar tus pautas." />

  return (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Activas ({grouped.active.length})</TabsTrigger>
        <TabsTrigger value="pending">Pendientes ({grouped.pending.length})</TabsTrigger>
        <TabsTrigger value="closed">Caducadas ({grouped.closed.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-4">
        <PromotionList items={grouped.active} emptyText="No tienes pautas activas." />
      </TabsContent>
      <TabsContent value="pending" className="mt-4">
        <PromotionList items={grouped.pending} emptyText="No tienes pautas pendientes." />
      </TabsContent>
      <TabsContent value="closed" className="mt-4">
        <PromotionList items={grouped.closed} emptyText="No hay pautas caducadas o cerradas." />
      </TabsContent>
    </Tabs>
  )
}

function PromotionList({ items, emptyText }: { items: PromotionView[]; emptyText: string }) {
  const qc = useQueryClient()
  const withdraw = useWithdrawPromotion()
  const checkout = usePromotionCheckout()

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    )
  }

  const retryPayment = async (id: string) => {
    try {
      const { widget } = await checkout.mutateAsync(id)
      openWompiWidget(widget, {
        onResult: (result) => {
          if (result.transaction?.status === 'APPROVED') {
            toast.success('Pago recibido. Tu pauta pasó a revisión.')
          }
          qc.invalidateQueries({ queryKey: promotionsHooks.KEYS.mine })
        },
      })
    } catch {
      /* toast en el hook */
    }
  }

  return (
    <div className="space-y-3">
      {items.map((promotion) => (
        <Card key={promotion.id}>
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className={`relative h-14 w-14 shrink-0 overflow-hidden bg-muted ${
                promotion.type === 'COMPOSER' ? 'rounded-full' : 'rounded-md'
              }`}
            >
              {promotion.resource?.imageUrl ? (
                <Image
                  src={promotion.resource.imageUrl}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">
                  {promotion.resource?.title ?? 'Recurso'}
                </p>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {promotion.type === 'TRACK' ? 'Track' : 'Compositor'}
                </Badge>
              </div>
              {promotion.resource?.subtitle && (
                <p className="truncate text-xs text-muted-foreground">
                  {promotion.resource.subtitle}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {formatCOP(Number(promotion.priceAmount))}
                {promotion.startsAt && ` · Publica ${formatDate(promotion.startsAt)}`}
                {promotion.expiresAt && ` · Expira ${formatDate(promotion.expiresAt)}`}
              </p>
              {promotion.status === 'REJECTED' && promotion.rejectionReason && (
                <p className="mt-1 text-xs text-destructive">Motivo: {promotion.rejectionReason}</p>
              )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <Badge variant={PROMOTION_STATUS_VARIANT[promotion.status]}>
                {PROMOTION_STATUS_LABEL[promotion.status]}
              </Badge>
              {promotion.status === 'PENDING_PAYMENT' && (
                <Button size="sm" onClick={() => retryPayment(promotion.id)}>
                  Pagar
                </Button>
              )}
              {(promotion.status === 'PENDING_PAYMENT' ||
                promotion.status === 'IN_REVIEW' ||
                promotion.status === 'SCHEDULED' ||
                promotion.status === 'ACTIVE' ||
                promotion.status === 'APPROVED') && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => withdraw.mutate(promotion.id)}
                  disabled={withdraw.isPending}
                >
                  Retirar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
