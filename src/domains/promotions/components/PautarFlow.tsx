'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Megaphone, Music2, User2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { Button } from '@/src/shared/components/UI/button'
import { Badge } from '@/src/shared/components/UI/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { openWompiWidget } from '@/src/domains/payments/wompi.client'
import {
  usePromotableResources,
  usePromotionPricing,
  useCreatePromotion,
  usePromotionCheckout,
  promotionsHooks,
} from '../hooks/use-promotions.hooks'
import type { PromotionType } from '../types/promotions.types'
import { formatCOP } from '../utils/promotion-format'

interface Selection {
  type: PromotionType
  targetId: string
  title: string
  price: number
}

/** Flujo de creación de pauta: elegir recurso del roster → confirmar → pagar. */
export function PautarFlow() {
  const qc = useQueryClient()
  const { data: promotable, isLoading, isError } = usePromotableResources()
  const { data: pricing } = usePromotionPricing()
  const createPromotion = useCreatePromotion()
  const checkout = usePromotionCheckout()

  const [selection, setSelection] = useState<Selection | null>(null)
  const [processing, setProcessing] = useState(false)

  const priceByType = useMemo(() => {
    const map = new Map<PromotionType, number>()
    for (const item of pricing ?? []) map.set(item.type, Number(item.amount))
    return map
  }, [pricing])

  if (isLoading) return <LoadingState message="Cargando tu catálogo…" />
  if (isError) return <ErrorState message="No se pudieron cargar tus recursos. Intenta de nuevo." />

  const tracks = promotable?.tracks ?? []
  const composers = promotable?.composers ?? []

  const confirmAndPay = async () => {
    if (!selection) return
    setProcessing(true)
    try {
      const created = await createPromotion.mutateAsync({
        type: selection.type,
        targetId: selection.targetId,
      })
      const { widget } = await checkout.mutateAsync(created.promotion.id)

      qc.invalidateQueries({ queryKey: promotionsHooks.KEYS.mine })
      qc.invalidateQueries({ queryKey: promotionsHooks.KEYS.promotable })
      setSelection(null)

      openWompiWidget(widget, {
        onResult: (result) => {
          if (result.transaction?.status === 'APPROVED') {
            toast.success('Pago recibido. Tu pauta pasó a revisión del administrador.')
          } else {
            toast.info('El pago no se completó. Puedes reintentarlo desde “Mis pautas”.')
          }
          qc.invalidateQueries({ queryKey: promotionsHooks.KEYS.mine })
        },
      })
    } catch {
      // El toast de error lo emiten los hooks.
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tracks">
        <TabsList>
          <TabsTrigger value="tracks" className="gap-2">
            <Music2 className="h-4 w-4" aria-hidden /> Tracks
          </TabsTrigger>
          <TabsTrigger value="composers" className="gap-2">
            <User2 className="h-4 w-4" aria-hidden /> Compositores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracks" className="mt-4">
          {tracks.length === 0 ? (
            <EmptyHint text="No hay tracks de tu roster disponibles para pautar." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => (
                <ResourceCard
                  key={track.id}
                  title={track.title}
                  subtitle={[track.author, track.genre].filter(Boolean).join(' · ') || undefined}
                  imageUrl={track.coverUrl}
                  disabled={track.alreadyPromoted}
                  price={priceByType.get('TRACK')}
                  onSelect={() =>
                    setSelection({
                      type: 'TRACK',
                      targetId: track.id,
                      title: track.title,
                      price: priceByType.get('TRACK') ?? 0,
                    })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="composers" className="mt-4">
          {composers.length === 0 ? (
            <EmptyHint text="No hay compositores en tu roster disponibles para pautar." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {composers.map((composer) => (
                <ResourceCard
                  key={composer.id}
                  title={composer.name}
                  subtitle={composer.genre ?? undefined}
                  imageUrl={composer.avatarUrl}
                  rounded
                  disabled={composer.alreadyPromoted}
                  price={priceByType.get('COMPOSER')}
                  onSelect={() =>
                    setSelection({
                      type: 'COMPOSER',
                      targetId: composer.id,
                      title: composer.name,
                      price: priceByType.get('COMPOSER') ?? 0,
                    })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selection} onOpenChange={(open) => !open && setSelection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" aria-hidden /> Confirmar pauta
            </DialogTitle>
            <DialogDescription>
              Vas a destacar <strong>{selection?.title}</strong>. La publicación dura 15 días y se
              activa al día siguiente si hay cupo; de lo contrario, entra en cola hasta que se libere
              un espacio. Tras confirmar, completa el pago para enviarla a revisión.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Valor de la pauta</span>
              <span className="text-lg font-semibold">{formatCOP(selection?.price ?? 0)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelection(null)} disabled={processing}>
              Cancelar
            </Button>
            <Button onClick={confirmAndPay} disabled={processing}>
              {processing ? 'Procesando…' : 'Confirmar y pagar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

interface ResourceCardProps {
  title: string
  subtitle?: string
  imageUrl?: string | null
  rounded?: boolean
  disabled?: boolean
  price?: number
  onSelect: () => void
}

function ResourceCard({ title, subtitle, imageUrl, rounded, disabled, price, onSelect }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-3 p-3">
        <div
          className={`relative h-14 w-14 shrink-0 overflow-hidden bg-muted ${rounded ? 'rounded-full' : 'rounded-md'}`}
        >
          {imageUrl ? (
            <Image src={imageUrl} alt="" fill sizes="56px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Music2 className="h-5 w-5" aria-hidden />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          {typeof price === 'number' && (
            <p className="mt-0.5 text-xs font-medium text-primary">{formatCOP(price)}</p>
          )}
        </div>
        {disabled ? (
          <Badge variant="secondary">Ya pautado</Badge>
        ) : (
          <Button size="sm" onClick={onSelect}>
            Pautar
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
