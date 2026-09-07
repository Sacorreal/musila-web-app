'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { promotionsClient } from '../services/promotions.client'
import type { PromotionType } from '../types/promotions.types'

const KEYS = {
  pricing: ['promotions', 'pricing'] as const,
  promotable: ['promotions', 'promotable'] as const,
  mine: ['promotions', 'mine'] as const,
}

export function usePromotionPricing() {
  return useQuery({ queryKey: KEYS.pricing, queryFn: promotionsClient.getPricing })
}

export function usePromotableResources() {
  return useQuery({ queryKey: KEYS.promotable, queryFn: promotionsClient.getPromotable })
}

export function useMyPromotions() {
  return useQuery({ queryKey: KEYS.mine, queryFn: promotionsClient.getMine })
}

export function useCreatePromotion() {
  return useMutation({
    mutationFn: (input: { type: PromotionType; targetId: string }) => promotionsClient.create(input),
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo crear la pauta'),
  })
}

export function usePromotionCheckout() {
  return useMutation({
    mutationFn: (promotionId: string) => promotionsClient.checkout(promotionId),
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo iniciar el pago'),
  })
}

export function useWithdrawPromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (promotionId: string) => promotionsClient.withdraw(promotionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.mine })
      qc.invalidateQueries({ queryKey: KEYS.promotable })
      toast.success('Pauta retirada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo retirar la pauta'),
  })
}

export const promotionsHooks = {
  usePromotionPricing,
  usePromotableResources,
  useMyPromotions,
  useCreatePromotion,
  usePromotionCheckout,
  useWithdrawPromotion,
  KEYS,
}
