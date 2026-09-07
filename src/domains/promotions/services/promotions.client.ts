'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  CreatePromotionResponse,
  PromotionCheckoutResponse,
  PromotionPricingItem,
  PromotionType,
  PromotionView,
  PromotableResources,
} from '../types/promotions.types'

/**
 * Acceso a la API de pautas desde el navegador. Usa `apiClient`, que adjunta
 * automáticamente el header `x-organization-id` de la organización activa (el
 * backend valida la membership real).
 */
export const promotionsClient = {
  getPricing: async (): Promise<PromotionPricingItem[]> => {
    const { data } = await apiClient.get<PromotionPricingItem[]>(apiURLs.promotions.pricing)
    return data
  },

  getPromotable: async (): Promise<PromotableResources> => {
    const { data } = await apiClient.get<PromotableResources>(apiURLs.promotions.promotable)
    return data
  },

  getMine: async (): Promise<PromotionView[]> => {
    const { data } = await apiClient.get<PromotionView[]>(apiURLs.promotions.mine)
    return data
  },

  create: async (input: { type: PromotionType; targetId: string }): Promise<CreatePromotionResponse> => {
    const { data } = await apiClient.post<CreatePromotionResponse>(apiURLs.promotions.base, input)
    return data
  },

  checkout: async (promotionId: string): Promise<PromotionCheckoutResponse> => {
    const { data } = await apiClient.post<PromotionCheckoutResponse>(
      apiURLs.promotions.checkout(promotionId),
    )
    return data
  },

  withdraw: async (promotionId: string): Promise<void> => {
    await apiClient.post(apiURLs.promotions.withdraw(promotionId))
  },
}
