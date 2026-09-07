'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  PromotionPricingItem,
  PromotionType,
} from '@/src/domains/promotions/types/promotions.types'

/** Precios vigentes por tipo de pauta. */
export async function fetchPromotionPricing(): Promise<PromotionPricingItem[]> {
  const client = await getServerApiClient()
  const { data } = await client.get<PromotionPricingItem[]>(apiURLs.promotionsAdmin.pricing)
  return data
}

/** Historial de vigencia de precios (opcionalmente filtrado por tipo). */
export async function fetchPromotionPricingHistory(
  type?: PromotionType,
): Promise<PromotionPricingItem[]> {
  const client = await getServerApiClient()
  const { data } = await client.get<PromotionPricingItem[]>(apiURLs.promotionsAdmin.pricingHistory, {
    params: type ? { type } : undefined,
  })
  return data
}
