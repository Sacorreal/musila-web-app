'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { EffectiveEntitlementDto } from '../authorization/authorization.types'
import type {
  MembershipDto,
  MembershipRoleDto,
  MembershipType,
  OrganizationDto,
  OrganizationStatus,
  RoleDto,
  TrackspaceDto,
} from './organizations.types'

export async function fetchOrganizations(status?: OrganizationStatus): Promise<OrganizationDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<OrganizationDto[]>(apiURLs.organizations.adminBase, {
    params: status ? { status } : undefined,
  })
  return response.data
}

export async function fetchOrganizationById(id: string): Promise<OrganizationDto> {
  const client = await getServerApiClient()
  const response = await client.get<OrganizationDto>(apiURLs.organizations.adminById(id))
  return response.data
}

export async function fetchOrganizationMembers(
  organizationId: string,
  type: MembershipType,
): Promise<MembershipDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<MembershipDto[]>(apiURLs.organizations.members(organizationId), {
    params: { type },
  })
  return response.data
}

export async function fetchOrganizationRoles(organizationId: string): Promise<RoleDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<RoleDto[]>(apiURLs.organizations.roles(organizationId))
  return response.data
}

export async function fetchMembershipRoles(
  organizationId: string,
  membershipId: string,
): Promise<MembershipRoleDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<MembershipRoleDto[]>(
    apiURLs.organizations.memberRoles(organizationId, membershipId),
  )
  return response.data
}

export async function fetchOrganizationTrackspaces(
  organizationId: string,
): Promise<TrackspaceDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<TrackspaceDto[]>(
    apiURLs.organizations.trackspaces(organizationId),
  )
  return response.data
}

export async function fetchOrganizationEntitlements(
  organizationId: string,
): Promise<EffectiveEntitlementDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<EffectiveEntitlementDto[]>(
    apiURLs.organizations.entitlements(organizationId),
  )
  return response.data
}
