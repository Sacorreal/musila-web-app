'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminCapabilities, fetchAuthorizationExplain } from './authorization.actions'
import { checkAuthorization, updateCapabilityConfig } from './authorization.client'
import type { UpdateCapabilityConfigInput } from './authorization.types'

export function useAdminCapabilities(filters: {
  domain?: string
  assignableTo?: string
  organizationType?: string
} = {}) {
  return useQuery({
    queryKey: ['admin', 'capabilities', filters],
    queryFn: () => fetchAdminCapabilities(filters),
    staleTime: 5 * 60 * 1000, // el catálogo se siembra por migración; cambia poco
  })
}

export function useUpdateCapabilityConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCapabilityConfigInput }) =>
      updateCapabilityConfig(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'capabilities'] })
      toast.success('Capability actualizada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al actualizar la capability'),
  })
}

export function useAuthorizationExplain(userId?: string, organizationId?: string) {
  return useQuery({
    queryKey: ['admin', 'authorization-explain', userId, organizationId],
    queryFn: () => fetchAuthorizationExplain(userId!, organizationId),
    enabled: !!userId,
  })
}

export function useAuthorizationCheck() {
  return useMutation({
    mutationFn: checkAuthorization,
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al simular el check'),
  })
}

export const adminAuthorizationHooks = {
  useAdminCapabilities,
  useUpdateCapabilityConfig,
  useAuthorizationExplain,
  useAuthorizationCheck,
}
