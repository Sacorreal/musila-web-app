'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'

/** Aprueba una pauta en revisión (la programa para publicación). */
export async function approvePromotion(id: string): Promise<void> {
  await apiClient.post(apiURLs.promotionsAdmin.approve(id))
}

/** Rechaza una pauta en revisión con motivo. */
export async function rejectPromotion(id: string, reason: string): Promise<void> {
  await apiClient.post(apiURLs.promotionsAdmin.reject(id), { reason })
}

/** Retira una pauta (acción administrativa). */
export async function withdrawPromotionAdmin(id: string): Promise<void> {
  await apiClient.post(apiURLs.promotionsAdmin.withdraw(id))
}
