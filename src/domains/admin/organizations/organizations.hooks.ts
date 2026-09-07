'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchMembershipRoles,
  fetchOrganizationById,
  fetchOrganizationEntitlements,
  fetchOrganizationMembers,
  fetchOrganizationRoles,
  fetchOrganizations,
  fetchOrganizationTrackspaces,
} from './organizations.actions'
import {
  approveOrganization,
  changeMembershipStatus,
  createOrganization,
  inviteOrganizationMember,
  markOrganizationCreated,
  rejectOrganization,
  setMembershipRoles,
  updateOrganization,
} from './organizations.client'
import type {
  CreateOrganizationInput,
  MembershipStatus,
  MembershipType,
  OrganizationStatus,
  UpdateOrganizationInput,
} from './organizations.types'

export function useOrganizations(status?: OrganizationStatus) {
  return useQuery({
    queryKey: ['admin', 'organizations', status ?? 'ALL'],
    queryFn: () => fetchOrganizations(status),
  })
}

export function useOrganization(id?: string) {
  return useQuery({
    queryKey: ['admin', 'organizations', id],
    queryFn: () => fetchOrganizationById(id!),
    enabled: !!id,
  })
}

export function useOrganizationMembers(organizationId?: string, type: MembershipType = 'ORGANIZATION') {
  return useQuery({
    queryKey: ['admin', 'organizations', organizationId, 'members', type],
    queryFn: () => fetchOrganizationMembers(organizationId!, type),
    enabled: !!organizationId,
  })
}

export function useOrganizationRoles(organizationId?: string) {
  return useQuery({
    queryKey: ['admin', 'organizations', organizationId, 'roles'],
    queryFn: () => fetchOrganizationRoles(organizationId!),
    enabled: !!organizationId,
  })
}

export function useMembershipRoles(organizationId?: string, membershipId?: string) {
  return useQuery({
    queryKey: ['admin', 'organizations', organizationId, 'members', membershipId, 'roles'],
    queryFn: () => fetchMembershipRoles(organizationId!, membershipId!),
    enabled: !!organizationId && !!membershipId,
  })
}

export function useOrganizationTrackspaces(organizationId?: string) {
  return useQuery({
    queryKey: ['admin', 'organizations', organizationId, 'trackspaces'],
    queryFn: () => fetchOrganizationTrackspaces(organizationId!),
    enabled: !!organizationId,
  })
}

export function useOrganizationEntitlements(organizationId?: string) {
  return useQuery({
    queryKey: ['admin', 'organizations', organizationId, 'entitlements'],
    queryFn: () => fetchOrganizationEntitlements(organizationId!),
    enabled: !!organizationId,
  })
}

export function useCreateOrganization() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateOrganizationInput) => createOrganization(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'organizations'] })
      toast.success('Organización creada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al crear la organización'),
  })
}

export function useUpdateOrganization() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrganizationInput }) =>
      updateOrganization(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'organizations'] })
      toast.success('Organización actualizada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al actualizar la organización'),
  })
}

export function useApproveOrganization() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveOrganization(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'organizations'] })
      toast.success('Solicitud aprobada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al aprobar la solicitud'),
  })
}

export function useRejectOrganization() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectOrganization(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'organizations'] })
      toast.success('Solicitud rechazada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al rechazar la solicitud'),
  })
}

export function useMarkOrganizationCreated() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => markOrganizationCreated(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'organizations'] })
      toast.success('Organización marcada como creada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al marcar la organización como creada'),
  })
}

export function useInviteOrganizationMember(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { type: MembershipType; userId: string }) =>
      inviteOrganizationMember(organizationId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'organizations', organizationId, 'members'] })
      toast.success('Invitación enviada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al invitar al miembro'),
  })
}

export function useChangeMembershipStatus(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      membershipId,
      status,
    }: {
      membershipId: string
      status: Exclude<MembershipStatus, 'INVITED' | 'PENDING'>
    }) => changeMembershipStatus(organizationId, membershipId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'organizations', organizationId, 'members'] })
      toast.success('Estado de la membership actualizado')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al cambiar el estado'),
  })
}

export function useSetMembershipRoles(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ membershipId, roleIds }: { membershipId: string; roleIds: string[] }) =>
      setMembershipRoles(organizationId, membershipId, roleIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'organizations', organizationId, 'members'] })
      toast.success('Roles asignados')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al asignar los roles'),
  })
}

export const adminOrganizationsHooks = {
  useOrganizations,
  useOrganization,
  useOrganizationMembers,
  useOrganizationRoles,
  useMembershipRoles,
  useOrganizationTrackspaces,
  useOrganizationEntitlements,
  useCreateOrganization,
  useUpdateOrganization,
  useApproveOrganization,
  useRejectOrganization,
  useMarkOrganizationCreated,
  useInviteOrganizationMember,
  useChangeMembershipStatus,
  useSetMembershipRoles,
}
