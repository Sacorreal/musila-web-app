'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchMyStaffPermissions, fetchStaffMembers } from './staff-members.actions'
import { assignStaffRole, inviteStaffMember, revokeStaffRole } from './staff-members.client'
import type { AssignStaffRoleInput, InviteStaffMemberInput, StaffMemberFilters } from './staff-members.types'

export function useStaffMembers(page = 1, limit = 10, filters: StaffMemberFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'staff-members', page, limit, filters],
    queryFn: () => fetchStaffMembers(page, limit, filters),
  })
}

export function useMyStaffPermissions() {
  return useQuery({
    queryKey: ['admin', 'staff-members', 'me', 'permissions'],
    queryFn: () => fetchMyStaffPermissions(),
    staleTime: 60 * 1000,
  })
}

export function useInviteStaffMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: InviteStaffMemberInput) => inviteStaffMember(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'staff-members'] })
      toast.success('Invitación enviada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al invitar al miembro del equipo'),
  })
}

export function useAssignStaffRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: AssignStaffRoleInput }) =>
      assignStaffRole(userId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'staff-members'] })
      toast.success('Rol asignado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al asignar el rol'),
  })
}

export function useRevokeStaffRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => revokeStaffRole(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'staff-members'] })
      toast.success('Rol interno revocado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al revocar el rol'),
  })
}

export const staffMembersHooks = {
  useStaffMembers,
  useMyStaffPermissions,
  useInviteStaffMember,
  useAssignStaffRole,
  useRevokeStaffRole,
}
