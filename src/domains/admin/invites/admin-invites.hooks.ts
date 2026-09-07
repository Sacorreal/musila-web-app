'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminInvites } from './admin-invites.actions'
import { createInvite, revokeInvite } from './admin-invites.client'
import type { AdminInviteFilters, CreateInviteAdminInput } from './admin-invites.types'

export function useAdminInvites(page = 1, limit = 10, filters: AdminInviteFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'invites', page, limit, filters],
    queryFn: () => fetchAdminInvites(page, limit, filters),
  })
}

export function useCreateInvite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateInviteAdminInput) => createInvite(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'invites'] })
      toast.success('Invitación creada y enviada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear la invitación'),
  })
}

export function useRevokeInvite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => revokeInvite(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'invites'] })
      toast.success('Invitación revocada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al revocar la invitación'),
  })
}

export const adminInvitesHooks = {
  useAdminInvites,
  useCreateInvite,
  useRevokeInvite,
}
