'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  CapabilityDto,
  CheckResponse,
  UpdateCapabilityConfigInput,
} from './authorization.types'

export async function updateCapabilityConfig(
  id: string,
  input: UpdateCapabilityConfigInput,
): Promise<CapabilityDto> {
  const response = await apiClient.patch<CapabilityDto>(apiURLs.authz.adminCapabilities.byId(id), input)
  return response.data
}

/** Simulador del Authorization Explorer: check de una capability con diagnóstico. */
export async function checkAuthorization(input: {
  userId: string
  organizationId?: string
  capability: string
}): Promise<CheckResponse> {
  const response = await apiClient.post<CheckResponse>(apiURLs.authz.adminCheck, input)
  return response.data
}
