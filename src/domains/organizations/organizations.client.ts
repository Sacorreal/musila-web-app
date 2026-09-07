'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  AccessRequestDto,
  ApproveAccessRequestInput,
  CreateInviteLinkInput,
  CreateOrgRoleInput,
  MembershipDto,
  MembershipRoleDto,
  MembershipStatus,
  MembershipType,
  RoleDto,
  TrackspaceDto,
  WorkspaceInviteLinkDto,
} from './organizations.types'

export async function createOrgRole(
  organizationId: string,
  input: CreateOrgRoleInput,
): Promise<RoleDto> {
  const response = await apiClient.post<RoleDto>(apiURLs.organizations.roles(organizationId), input)
  return response.data
}

export async function updateOrgRole(
  organizationId: string,
  roleId: string,
  input: { name?: string; description?: string; isActive?: boolean },
): Promise<RoleDto> {
  const response = await apiClient.patch<RoleDto>(
    apiURLs.organizations.roleById(organizationId, roleId),
    input,
  )
  return response.data
}

export async function deleteOrgRole(organizationId: string, roleId: string): Promise<void> {
  await apiClient.delete(apiURLs.organizations.roleById(organizationId, roleId))
}

export async function setOrgRoleCapabilities(
  organizationId: string,
  roleId: string,
  capabilityIds: string[],
): Promise<RoleDto> {
  const response = await apiClient.put<RoleDto>(
    apiURLs.organizations.roleCapabilities(organizationId, roleId),
    { capabilityIds },
  )
  return response.data
}

export async function inviteOrgMember(
  organizationId: string,
  input: { type: MembershipType; userId: string },
): Promise<MembershipDto> {
  const response = await apiClient.post<MembershipDto>(
    apiURLs.organizations.members(organizationId),
    input,
  )
  return response.data
}

export async function setOrgMemberRoles(
  organizationId: string,
  membershipId: string,
  roleIds: string[],
): Promise<MembershipRoleDto[]> {
  const response = await apiClient.put<MembershipRoleDto[]>(
    apiURLs.organizations.memberRoles(organizationId, membershipId),
    { roleIds },
  )
  return response.data
}

export async function acceptMembership(
  organizationId: string,
  membershipId: string,
): Promise<MembershipDto> {
  const response = await apiClient.post<MembershipDto>(
    apiURLs.organizations.memberAccept(organizationId, membershipId),
  )
  return response.data
}

export async function updateOrgTrackspace(
  organizationId: string,
  trackspaceId: string,
  input: { name?: string; logoUrl?: string | null },
): Promise<TrackspaceDto> {
  const response = await apiClient.patch<TrackspaceDto>(
    apiURLs.organizations.trackspaceById(organizationId, trackspaceId),
    input,
  )
  return response.data
}

export async function regenerateInviteLink(
  organizationId: string,
  input: CreateInviteLinkInput = {},
): Promise<WorkspaceInviteLinkDto> {
  const response = await apiClient.post<WorkspaceInviteLinkDto>(
    apiURLs.organizations.inviteLinkRegenerate(organizationId),
    input,
  )
  return response.data
}

export async function revokeInviteLink(organizationId: string): Promise<void> {
  await apiClient.post(apiURLs.organizations.inviteLinkRevoke(organizationId))
}

export async function approveAccessRequest(
  organizationId: string,
  requestId: string,
  input: ApproveAccessRequestInput,
): Promise<AccessRequestDto> {
  const response = await apiClient.post<AccessRequestDto>(
    apiURLs.organizations.accessRequestApprove(organizationId, requestId),
    input,
  )
  return response.data
}

export async function rejectAccessRequest(
  organizationId: string,
  requestId: string,
  reason?: string,
): Promise<AccessRequestDto> {
  const response = await apiClient.post<AccessRequestDto>(
    apiURLs.organizations.accessRequestReject(organizationId, requestId),
    { reason },
  )
  return response.data
}

export async function changeMemberStatus(
  organizationId: string,
  membershipId: string,
  status: MembershipStatus,
): Promise<MembershipDto> {
  const response = await apiClient.patch<MembershipDto>(
    apiURLs.organizations.memberStatus(organizationId, membershipId),
    { status },
  )
  return response.data
}
