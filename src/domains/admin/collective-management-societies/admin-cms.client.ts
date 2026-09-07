'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  AdminCollectiveManagementSocietyDto,
  CreateCollectiveManagementSocietyAdminInput,
  UpdateCollectiveManagementSocietyAdminInput,
} from './admin-cms.types'

export async function createCollectiveManagementSociety(
  input: CreateCollectiveManagementSocietyAdminInput,
): Promise<AdminCollectiveManagementSocietyDto> {
  const response = await apiClient.post<AdminCollectiveManagementSocietyDto>(
    apiURLs.referenceData.collectiveManagementSocieties.base,
    input,
  )
  return response.data
}

export async function updateCollectiveManagementSociety(
  id: string,
  input: UpdateCollectiveManagementSocietyAdminInput,
): Promise<AdminCollectiveManagementSocietyDto> {
  const response = await apiClient.put<AdminCollectiveManagementSocietyDto>(
    apiURLs.referenceData.collectiveManagementSocieties.byId(id),
    input,
  )
  return response.data
}

/** Nunca es hard-delete: el backend marca `status = DEPRECATED`. */
export async function deprecateCollectiveManagementSociety(id: string): Promise<void> {
  await apiClient.delete(apiURLs.referenceData.collectiveManagementSocieties.byId(id))
}
