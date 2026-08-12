'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PromotionType } from '@/src/domains/promotions/types/promotions.types'

/** Actualiza (versionando) el precio de un tipo de pauta. */
export async function updatePromotionPrice(input: {
  type: PromotionType
  amount: number
}): Promise<void> {
  await apiClient.put(apiURLs.promotionsAdmin.pricing, input)
}
