'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminAffiliateById, fetchAdminAffiliates } from './admin-affiliates.actions'
import { createAffiliate, deleteAffiliate, updateAffiliateStatus, updateAffiliateTier } from './admin-affiliates.client'
import type {
  AdminAffiliateFilters,
  AffiliateStatus,
  AffiliateTier,
  CreateAffiliateAdminInput,
} from './admin-affiliates.types'

export function useAdminAffiliates(page = 1, limit = 10, filters: AdminAffiliateFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'affiliates', page, limit, filters],
    queryFn: () => fetchAdminAffiliates(page, limit, filters),
  })
}

export function useAdminAffiliate(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'affiliates', 'detail', id],
    queryFn: () => fetchAdminAffiliateById(id as string),
    enabled: !!id,
  })
}

export function useCreateAffiliate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAffiliateAdminInput) => createAffiliate(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'affiliates'] })
      toast.success('Afiliado creado correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Error al crear el afiliado')
    },
  })
}

export function useUpdateAffiliateStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AffiliateStatus }) => updateAffiliateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'affiliates'] })
      toast.success('Estado del afiliado actualizado')
    },
    onError: () => toast.error('Error al actualizar el estado'),
  })
}

export function useUpdateAffiliateTier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, tier }: { id: string; tier: AffiliateTier }) => updateAffiliateTier(id, tier),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'affiliates'] })
      toast.success('Nivel del afiliado actualizado')
    },
    onError: () => toast.error('Error al actualizar el nivel'),
  })
}

export function useDeleteAffiliate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAffiliate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'affiliates'] })
      toast.success('Afiliado eliminado')
    },
    onError: () => toast.error('Error al eliminar el afiliado'),
  })
}

export const adminAffiliatesHooks = {
  useAdminAffiliates,
  useAdminAffiliate,
  useCreateAffiliate,
  useUpdateAffiliateStatus,
  useUpdateAffiliateTier,
  useDeleteAffiliate,
}
