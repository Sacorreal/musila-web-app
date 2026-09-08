import type { CampaignClosedReason, CampaignStatus } from '../types/campaigns.types'

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  ACTIVE: 'Activa',
  CLOSED: 'Cerrada',
}

export const CAMPAIGN_CLOSED_REASON_LABEL: Record<CampaignClosedReason, string> = {
  DEADLINE: 'Fecha límite cumplida',
  QUOTA: 'Cupo de canciones alcanzado',
  MANUAL: 'Cerrada manualmente',
}

export function formatDate(value?: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Días restantes hasta la fecha límite (negativo si ya venció). */
export function daysUntil(deadline: string): number {
  const diffMs = new Date(deadline).getTime() - Date.now()
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000))
}

/** Texto de urgencia para la tarjeta pública (genera urgencia en los compositores, §Publicación). */
export function urgencyLabel(deadline: string): string {
  const days = daysUntil(deadline)
  if (days < 0) return 'Vencida'
  if (days === 0) return 'Vence hoy'
  if (days === 1) return 'Vence mañana'
  if (days <= 7) return `Vence en ${days} días`
  return `Vence el ${formatDate(deadline)}`
}
