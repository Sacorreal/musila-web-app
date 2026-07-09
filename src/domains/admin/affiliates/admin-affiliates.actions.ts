'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminAffiliateDto, AdminAffiliateFilters, PaginatedAdminAffiliates } from './admin-affiliates.types'

export async function fetchAdminAffiliates(
  page = 1,
  limit = 10,
  filters: AdminAffiliateFilters = {},
): Promise<PaginatedAdminAffiliates> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset }
  if (filters.status) params.status = filters.status
  if (filters.tier) params.tier = filters.tier
  if (filters.q) params.q = filters.q
  const response = await client.get<PaginatedAdminAffiliates>(apiURLs.affiliates.admin.base, { params })
  return response.data
}

export async function fetchAdminAffiliateById(id: string): Promise<AdminAffiliateDto> {
  const client = await getServerApiClient()
  const response = await client.get<AdminAffiliateDto>(apiURLs.affiliates.admin.byId(id))
  return response.data
}
