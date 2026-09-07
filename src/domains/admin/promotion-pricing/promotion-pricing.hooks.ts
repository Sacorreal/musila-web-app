'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchPromotionPricing,
  fetchPromotionPricingHistory,
} from './promotion-pricing.actions'
import { updatePromotionPrice } from './promotion-pricing.client'
import type { PromotionType } from '@/src/domains/promotions/types/promotions.types'

const KEY = ['admin', 'promotion-pricing'] as const

export function usePromotionPricingAdmin() {
  return useQuery({ queryKey: KEY, queryFn: fetchPromotionPricing })
}

export function usePromotionPricingHistory(type?: PromotionType) {
  return useQuery({
    queryKey: [...KEY, 'history', type ?? 'all'],
    queryFn: () => fetchPromotionPricingHistory(type),
  })
}

export function useUpdatePromotionPrice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { type: PromotionType; amount: number }) => updatePromotionPrice(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      toast.success('Precio actualizado. Aplica solo a nuevas pautas.')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo actualizar el precio'),
  })
}

export const adminPromotionPricingHooks = {
  usePromotionPricingAdmin,
  usePromotionPricingHistory,
  useUpdatePromotionPrice,
}
