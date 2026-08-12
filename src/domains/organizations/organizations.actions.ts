'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  AccessRequestDto,
  AccessRequestStatus,
  CapabilityDto,
  MembershipDto,
  MembershipType,
  MyMembershipsResponse,
  RoleDto,
  TrackspaceDto,
  WorkspaceInviteLinkDto,
} from './organizations.types'

export async function fetchMyMemberships(): Promise<MyMembershipsResponse> {
  const client = await getServerApiClient()
  const response = await client.get<MyMembershipsResponse>(apiURLs.authz.myMemberships)
  return response.data
}

/** Capabilities efectivas del usuario dentro de la organización (para gates de la UI del workspace). */
export async function fetchMyOrgCapabilities(organizationId: string): Promise<string[]> {
  const client = await getServerApiClient()
  const response = await client.get<{ capabilities: string[] }>(apiURLs.authz.myCapabilities, {
    headers: { 'x-organization-id': organizationId },
  })
  return response.data.capabilities
}

/**
 * MATRIZ DE CAPACIDADES para el Role Builder (§15): siempre vía API, nunca
 * hardcoded. El backend filtra por tipo de sujeto; el tipo de organización
 * se re-valida al persistir.
 */
export async function fetchCapabilityCatalog(
  organizationId: string,
  filters: { assignableTo?: string; organizationType?: string } = {},
): Promise<CapabilityDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<CapabilityDto[]>(apiURLs.authz.permissionsCatalog, {
    params: filters,
    headers: { 'x-organization-id': organizationId },
  })
  return response.data
}

export async function fetchOrgRoles(organizationId: string): Promise<RoleDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<RoleDto[]>(apiURLs.organizations.roles(organizationId))
  return response.data
}

export async function fetchOrgMembers(
  organizationId: string,
  type: MembershipType,
): Promise<MembershipDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<MembershipDto[]>(apiURLs.organizations.members(organizationId), {
    params: { type },
  })
  return response.data
}

export async function fetchOrgTrackspaces(organizationId: string): Promise<TrackspaceDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<TrackspaceDto[]>(
    apiURLs.organizations.trackspaces(organizationId),
  )
  return response.data
}

/** Enlace de invitación reutilizable activo del workspace (lo crea si no existe). */
export async function fetchInviteLink(
  organizationId: string,
): Promise<WorkspaceInviteLinkDto> {
  const client = await getServerApiClient()
  const response = await client.get<WorkspaceInviteLinkDto>(
    apiURLs.organizations.inviteLink(organizationId),
  )
  return response.data
}

/** Solicitudes de acceso del workspace, filtrables por estado. */
export async function fetchAccessRequests(
  organizationId: string,
  status?: AccessRequestStatus,
): Promise<AccessRequestDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<AccessRequestDto[]>(
    apiURLs.organizations.accessRequests(organizationId),
    { params: status ? { status } : undefined },
  )
  return response.data
}
