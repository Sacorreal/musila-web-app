'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  AdminAffiliateDto,
  AffiliateStatus,
  AffiliateTier,
  CreateAffiliateAdminInput,
} from './admin-affiliates.types'

export async function createAffiliate(input: CreateAffiliateAdminInput): Promise<AdminAffiliateDto> {
  const response = await apiClient.post<AdminAffiliateDto>(apiURLs.affiliates.admin.base, input)
  return response.data
}

export async function updateAffiliateStatus(id: string, status: AffiliateStatus): Promise<AdminAffiliateDto> {
  const response = await apiClient.patch<AdminAffiliateDto>(apiURLs.affiliates.admin.status(id), { status })
  return response.data
}

export async function updateAffiliateTier(id: string, tier: AffiliateTier): Promise<AdminAffiliateDto> {
  const response = await apiClient.patch<AdminAffiliateDto>(apiURLs.affiliates.admin.tier(id), { tier })
  return response.data
}

export async function deleteAffiliate(id: string): Promise<void> {
  await apiClient.delete(apiURLs.affiliates.admin.byId(id))
}
