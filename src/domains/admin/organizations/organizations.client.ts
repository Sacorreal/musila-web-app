'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  CreateOrganizationInput,
  MembershipDto,
  MembershipRoleDto,
  MembershipStatus,
  MembershipType,
  OrganizationDto,
  TrackspaceDto,
  UpdateOrganizationInput,
} from './organizations.types'

export async function createOrganization(input: CreateOrganizationInput): Promise<OrganizationDto> {
  const response = await apiClient.post<OrganizationDto>(apiURLs.organizations.adminBase, input)
  return response.data
}

export async function updateOrganization(
  id: string,
  input: UpdateOrganizationInput,
): Promise<OrganizationDto> {
  const response = await apiClient.patch<OrganizationDto>(apiURLs.organizations.adminById(id), input)
  return response.data
}

export async function inviteOrganizationMember(
  organizationId: string,
  input: { type: MembershipType; userId: string },
): Promise<MembershipDto> {
  const response = await apiClient.post<MembershipDto>(
    apiURLs.organizations.members(organizationId),
    input,
  )
  return response.data
}

export async function changeMembershipStatus(
  organizationId: string,
  membershipId: string,
  status: Exclude<MembershipStatus, 'INVITED' | 'PENDING'>,
): Promise<MembershipDto> {
  const response = await apiClient.patch<MembershipDto>(
    apiURLs.organizations.memberStatus(organizationId, membershipId),
    { status },
  )
  return response.data
}

export async function setMembershipRoles(
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

export async function updateTrackspace(
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
