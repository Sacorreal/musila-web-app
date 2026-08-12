'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import { adminPromotionsHooks } from '@/src/domains/admin/promotions/promotions-admin.hooks'
import type { PromotionStatus, PromotionView } from '@/src/domains/promotions/types/promotions.types'
import {
  PROMOTION_STATUS_LABEL,
  PROMOTION_STATUS_VARIANT,
  formatCOP,
  formatDate,
} from '@/src/domains/promotions/utils/promotion-format'

const STATUS_OPTIONS: { value: PromotionStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos los estados' },
  { value: 'IN_REVIEW', label: 'En revisión' },
  { value: 'SCHEDULED', label: 'Programadas' },
  { value: 'ACTIVE', label: 'Activas' },
  { value: 'PENDING_PAYMENT', label: 'Pendientes de pago' },
  { value: 'REJECTED', label: 'Rechazadas' },
  { value: 'EXPIRED', label: 'Caducadas' },
]

export default function AdminPromotionsPage() {
  const [status, setStatus] = useState<PromotionStatus | 'ALL'>('IN_REVIEW')
  const { data, isLoading, error } = adminPromotionsHooks.useAdminPromotions(
    status === 'ALL' ? undefined : { status },
  )
  const approve = adminPromotionsHooks.useApprovePromotion()
  const reject = adminPromotionsHooks.useRejectPromotion()

  const [rejectTarget, setRejectTarget] = useState<PromotionView | null>(null)
  const [reason, setReason] = useState('')

  const submitReject = () => {
    if (!rejectTarget || reason.trim().length < 3) return
    reject.mutate(
      { id: rejectTarget.id, reason: reason.trim() },
      {
        onSuccess: () => {
          setRejectTarget(null)
          setReason('')
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pautas"
        description="Revisa las solicitudes de destacado pagadas y aprueba o rechaza su publicación."
        actions={
          <Select value={status} onValueChange={(v) => setStatus(v as PromotionStatus | 'ALL')}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isLoading ? (
        <LoadingState message="Cargando pautas…" />
      ) : error ? (
        <ErrorState message="No se pudieron cargar las pautas." />
      ) : (data?.length ?? 0) === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No hay pautas para el filtro seleccionado.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Recurso</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Solicitante</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Vigencia</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data!.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{promotion.resource?.title ?? '—'}</p>
                    {promotion.resource?.subtitle && (
                      <p className="text-xs text-muted-foreground">{promotion.resource.subtitle}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">{promotion.type === 'TRACK' ? 'Track' : 'Compositor'}</td>
                  <td className="px-4 py-3">
                    <p>{promotion.requester?.name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{promotion.requester?.email}</p>
                  </td>
                  <td className="px-4 py-3">{formatCOP(Number(promotion.priceAmount))}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {promotion.startsAt ? formatDate(promotion.startsAt) : '—'}
                    {promotion.expiresAt ? ` → ${formatDate(promotion.expiresAt)}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={PROMOTION_STATUS_VARIANT[promotion.status]}>
                      {PROMOTION_STATUS_LABEL[promotion.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {promotion.status === 'IN_REVIEW' ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => approve.mutate(promotion.id)}
                          disabled={approve.isPending}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden /> Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setRejectTarget(promotion)}
                        >
                          <XCircle className="mr-1 h-4 w-4" aria-hidden /> Rechazar
                        </Button>
                      </div>
                    ) : (
                      <span className="block text-right text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null)
            setReason('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar pauta</DialogTitle>
            <DialogDescription>
              Indica el motivo del rechazo de “{rejectTarget?.resource?.title}”. Se notificará al
              solicitante.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motivo del rechazo (mínimo 3 caracteres)…"
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectTarget(null)
                setReason('')
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={submitReject}
              disabled={reason.trim().length < 3 || reject.isPending}
            >
              Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
