'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  AdminIntellectualPropertyDto,
  CreateIntellectualPropertyAdminInput,
  UpdateIntellectualPropertyAdminInput,
} from './admin-ip.types'

export async function createIntellectualProperty(
  input: CreateIntellectualPropertyAdminInput,
): Promise<AdminIntellectualPropertyDto> {
  const response = await apiClient.post<AdminIntellectualPropertyDto>(apiURLs.intellectualProperty.base, input)
  return response.data
}

export async function updateIntellectualProperty(
  id: string,
  input: UpdateIntellectualPropertyAdminInput,
): Promise<AdminIntellectualPropertyDto> {
  const response = await apiClient.put<AdminIntellectualPropertyDto>(apiURLs.intellectualProperty.byId(id), input)
  return response.data
}

export async function deleteIntellectualProperty(id: string): Promise<void> {
  await apiClient.delete(apiURLs.intellectualProperty.byId(id))
}
