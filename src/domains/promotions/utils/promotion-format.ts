import type { PromotionStatus } from '../types/promotions.types'

/** Etiqueta legible de cada estado de la máquina de estados de una pauta. */
export const PROMOTION_STATUS_LABEL: Record<PromotionStatus, string> = {
  DRAFT: 'Borrador',
  PENDING_PAYMENT: 'Pendiente de pago',
  IN_REVIEW: 'En revisión',
  APPROVED: 'Aprobada',
  SCHEDULED: 'Programada',
  ACTIVE: 'Activa',
  FINISHED: 'Finalizada',
  REJECTED: 'Rechazada',
  WITHDRAWN: 'Retirada',
  EXPIRED: 'Caducada',
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

/** Variante visual del badge según el estado. */
export const PROMOTION_STATUS_VARIANT: Record<PromotionStatus, BadgeVariant> = {
  DRAFT: 'outline',
  PENDING_PAYMENT: 'secondary',
  IN_REVIEW: 'secondary',
  APPROVED: 'default',
  SCHEDULED: 'default',
  ACTIVE: 'default',
  FINISHED: 'outline',
  REJECTED: 'destructive',
  WITHDRAWN: 'outline',
  EXPIRED: 'outline',
}

/** Agrupación de estados para las pestañas del panel del publisher. */
export const ACTIVE_STATUSES: PromotionStatus[] = ['APPROVED', 'SCHEDULED', 'ACTIVE']
export const PENDING_STATUSES: PromotionStatus[] = ['DRAFT', 'PENDING_PAYMENT', 'IN_REVIEW']
export const CLOSED_STATUSES: PromotionStatus[] = ['FINISHED', 'REJECTED', 'WITHDRAWN', 'EXPIRED']

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value?: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
