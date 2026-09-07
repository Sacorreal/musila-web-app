'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminCollectiveManagementSocieties } from './admin-cms.actions'
import {
  createCollectiveManagementSociety,
  deprecateCollectiveManagementSociety,
  updateCollectiveManagementSociety,
} from './admin-cms.client'
import type { CreateCollectiveManagementSocietyAdminInput, UpdateCollectiveManagementSocietyAdminInput } from './admin-cms.types'

const QUERY_KEY = ['admin', 'collective-management-societies']

export function useAdminCollectiveManagementSocieties(page = 1, limit = 10, search?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, page, limit, search ?? ''],
    queryFn: () => fetchAdminCollectiveManagementSocieties(page, limit, search),
  })
}

export function useCreateCollectiveManagementSociety() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCollectiveManagementSocietyAdminInput) => createCollectiveManagementSociety(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Sociedad creada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear la sociedad'),
  })
}

export function useUpdateCollectiveManagementSociety() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCollectiveManagementSocietyAdminInput }) =>
      updateCollectiveManagementSociety(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Sociedad actualizada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar la sociedad'),
  })
}

export function useDeprecateCollectiveManagementSociety() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deprecateCollectiveManagementSociety(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Sociedad marcada como depreciada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al depreciar la sociedad'),
  })
}

export const adminCmsHooks = {
  useAdminCollectiveManagementSocieties,
  useCreateCollectiveManagementSociety,
  useUpdateCollectiveManagementSociety,
  useDeprecateCollectiveManagementSociety,
}
