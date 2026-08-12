'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminPromotions } from './promotions-admin.actions'
import { approvePromotion, rejectPromotion, withdrawPromotionAdmin } from './promotions-admin.client'
import type { PromotionStatus, PromotionType } from '@/src/domains/promotions/types/promotions.types'

const ADMIN_KEY = ['admin', 'promotions'] as const

export function useAdminPromotions(filters?: { status?: PromotionStatus; type?: PromotionType }) {
  return useQuery({
    queryKey: [...ADMIN_KEY, filters?.status ?? 'all', filters?.type ?? 'all'],
    queryFn: () => fetchAdminPromotions(filters),
  })
}

export function useApprovePromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approvePromotion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_KEY })
      toast.success('Pauta aprobada y programada para publicación')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo aprobar la pauta'),
  })
}

export function useRejectPromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectPromotion(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_KEY })
      toast.success('Pauta rechazada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo rechazar la pauta'),
  })
}

export function useWithdrawPromotionAdmin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => withdrawPromotionAdmin(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_KEY })
      toast.success('Pauta retirada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'No se pudo retirar la pauta'),
  })
}

export const adminPromotionsHooks = {
  useAdminPromotions,
  useApprovePromotion,
  useRejectPromotion,
  useWithdrawPromotionAdmin,
}
