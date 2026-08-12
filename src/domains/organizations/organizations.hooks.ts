'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchAccessRequests,
  fetchCapabilityCatalog,
  fetchInviteLink,
  fetchMyMemberships,
  fetchMyOrgCapabilities,
  fetchOrgMembers,
  fetchOrgRoles,
  fetchOrgTrackspaces,
} from './organizations.actions'
import {
  acceptMembership,
  approveAccessRequest,
  changeMemberStatus,
  createOrgRole,
  deleteOrgRole,
  inviteOrgMember,
  regenerateInviteLink,
  rejectAccessRequest,
  revokeInviteLink,
  setOrgMemberRoles,
  setOrgRoleCapabilities,
  updateOrgRole,
  updateOrgTrackspace,
} from './organizations.client'
import type {
  AccessRequestStatus,
  ApproveAccessRequestInput,
  CreateInviteLinkInput,
  CreateOrgRoleInput,
  MembershipStatus,
  MembershipType,
} from './organizations.types'

export function useMyMemberships() {
  return useQuery({ queryKey: ['organizations', 'my-memberships'], queryFn: () => fetchMyMemberships() })
}

export function useMyOrgCapabilities(organizationId?: string) {
  return useQuery({
    queryKey: ['organizations', organizationId, 'my-capabilities'],
    queryFn: () => fetchMyOrgCapabilities(organizationId!),
    enabled: !!organizationId,
  })
}

export function useCapabilityCatalog(
  organizationId?: string,
  filters: { assignableTo?: string; organizationType?: string } = {},
) {
  return useQuery({
    queryKey: ['organizations', organizationId, 'capability-catalog', filters],
    queryFn: () => fetchCapabilityCatalog(organizationId!, filters),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useOrgRoles(organizationId?: string) {
  return useQuery({
    queryKey: ['organizations', organizationId, 'roles'],
    queryFn: () => fetchOrgRoles(organizationId!),
    enabled: !!organizationId,
  })
}

export function useOrgMembers(organizationId?: string, type: MembershipType = 'ORGANIZATION') {
  return useQuery({
    queryKey: ['organizations', organizationId, 'members', type],
    queryFn: () => fetchOrgMembers(organizationId!, type),
    enabled: !!organizationId,
  })
}

export function useOrgTrackspaces(organizationId?: string) {
  return useQuery({
    queryKey: ['organizations', organizationId, 'trackspaces'],
    queryFn: () => fetchOrgTrackspaces(organizationId!),
    enabled: !!organizationId,
  })
}

export function useCreateOrgRole(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateOrgRoleInput) => createOrgRole(organizationId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'roles'] })
      toast.success('Rol creado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear el rol'),
  })
}

export function useUpdateOrgRole(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, input }: { roleId: string; input: { name?: string; description?: string; isActive?: boolean } }) =>
      updateOrgRole(organizationId, roleId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'roles'] })
      toast.success('Rol actualizado')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al actualizar el rol'),
  })
}

export function useDeleteOrgRole(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (roleId: string) => deleteOrgRole(organizationId, roleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'roles'] })
      toast.success('Rol eliminado')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al eliminar el rol'),
  })
}

export function useSetOrgRoleCapabilities(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, capabilityIds }: { roleId: string; capabilityIds: string[] }) =>
      setOrgRoleCapabilities(organizationId, roleId, capabilityIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'roles'] })
      toast.success('Capabilities del rol actualizadas')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al actualizar las capabilities'),
  })
}

export function useInviteOrgMember(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { type: MembershipType; userId: string }) =>
      inviteOrgMember(organizationId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'members'] })
      toast.success('Invitación enviada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al invitar al miembro'),
  })
}

export function useSetOrgMemberRoles(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ membershipId, roleIds }: { membershipId: string; roleIds: string[] }) =>
      setOrgMemberRoles(organizationId, membershipId, roleIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'members'] })
      toast.success('Roles asignados')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al asignar los roles'),
  })
}

export function useAcceptMembership() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ organizationId, membershipId }: { organizationId: string; membershipId: string }) =>
      acceptMembership(organizationId, membershipId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', 'my-memberships'] })
      toast.success('Invitación aceptada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al aceptar la invitación'),
  })
}

export function useInviteLink(organizationId?: string) {
  return useQuery({
    queryKey: ['organizations', organizationId, 'invite-link'],
    queryFn: () => fetchInviteLink(organizationId!),
    enabled: !!organizationId,
  })
}

export function useRegenerateInviteLink(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateInviteLinkInput = {}) => regenerateInviteLink(organizationId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'invite-link'] })
      toast.success('Enlace de invitación regenerado')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al regenerar el enlace'),
  })
}

export function useRevokeInviteLink(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => revokeInviteLink(organizationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'invite-link'] })
      toast.success('Enlace de invitación revocado')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al revocar el enlace'),
  })
}

/**
 * Solicitudes de acceso del workspace. Refresca cada 4 s para reflejar en la UI
 * las nuevas solicitudes con latencia < 5 s (§ requisito de tiempo real).
 */
export function useAccessRequests(organizationId?: string, status?: AccessRequestStatus) {
  return useQuery({
    queryKey: ['organizations', organizationId, 'access-requests', status ?? 'all'],
    queryFn: () => fetchAccessRequests(organizationId!, status),
    enabled: !!organizationId,
    refetchInterval: 4000,
  })
}

export function useApproveAccessRequest(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, input }: { requestId: string; input: ApproveAccessRequestInput }) =>
      approveAccessRequest(organizationId, requestId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'access-requests'] })
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'members'] })
      toast.success('Solicitud aprobada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al aprobar la solicitud'),
  })
}

export function useRejectAccessRequest(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason?: string }) =>
      rejectAccessRequest(organizationId, requestId, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'access-requests'] })
      toast.success('Solicitud rechazada')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al rechazar la solicitud'),
  })
}

export function useChangeMemberStatus(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ membershipId, status }: { membershipId: string; status: MembershipStatus }) =>
      changeMemberStatus(organizationId, membershipId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'members'] })
      toast.success('Miembro actualizado')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al actualizar el miembro'),
  })
}

export function useUpdateOrgTrackspace(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      trackspaceId,
      input,
    }: {
      trackspaceId: string
      input: { name?: string; logoUrl?: string | null }
    }) => updateOrgTrackspace(organizationId, trackspaceId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', organizationId, 'trackspaces'] })
      toast.success('Workspace actualizado')
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Error al actualizar el workspace'),
  })
}

export const organizationsHooks = {
  useMyMemberships,
  useMyOrgCapabilities,
  useCapabilityCatalog,
  useOrgRoles,
  useOrgMembers,
  useOrgTrackspaces,
  useCreateOrgRole,
  useUpdateOrgRole,
  useDeleteOrgRole,
  useSetOrgRoleCapabilities,
  useInviteOrgMember,
  useSetOrgMemberRoles,
  useAcceptMembership,
  useUpdateOrgTrackspace,
  useInviteLink,
  useRegenerateInviteLink,
  useRevokeInviteLink,
  useAccessRequests,
  useApproveAccessRequest,
  useRejectAccessRequest,
  useChangeMemberStatus,
}
