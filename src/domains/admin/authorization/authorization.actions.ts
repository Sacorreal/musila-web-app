'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { CapabilityDto, ExplainResponse, MyCapabilities } from './authorization.types'

/**
 * Capabilities efectivas del usuario autenticado (contexto personal +
 * plataforma). Reemplaza a fetchMyStaffPermissions: los gates del panel
 * /admin filtran con keys `platform.*`. Solo UX — la autorización real la
 * hace el backend en cada request.
 */
export async function fetchMyCapabilities(): Promise<MyCapabilities> {
  const client = await getServerApiClient()
  const response = await client.get<MyCapabilities>(apiURLs.authz.myCapabilities)
  return response.data
}

/** Catálogo completo de la MATRIZ DE CAPACIDADES (incluye inactivas) para el admin. */
export async function fetchAdminCapabilities(filters: {
  domain?: string
  assignableTo?: string
  organizationType?: string
} = {}): Promise<CapabilityDto[]> {
  const client = await getServerApiClient()
  const response = await client.get<CapabilityDto[]>(apiURLs.authz.adminCapabilities.base, {
    params: filters,
  })
  return response.data
}

/** Authorization Explorer: capabilities efectivas de un usuario con su origen. */
export async function fetchAuthorizationExplain(
  userId: string,
  organizationId?: string,
): Promise<ExplainResponse> {
  const client = await getServerApiClient()
  const response = await client.get<ExplainResponse>(apiURLs.authz.adminExplain, {
    params: { userId, ...(organizationId ? { organizationId } : {}) },
  })
  return response.data
}
