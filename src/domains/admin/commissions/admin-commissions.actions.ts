'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminCommissionFilters, PaginatedAdminCommissions } from './admin-commissions.types'

export async function fetchAdminCommissions(
  page = 1,
  limit = 10,
  filters: AdminCommissionFilters = {},
): Promise<PaginatedAdminCommissions> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset }
  if (filters.status) params.status = filters.status
  if (filters.affiliateId) params.affiliateId = filters.affiliateId
  const response = await client.get<PaginatedAdminCommissions>(apiURLs.affiliates.admin.commissions, { params })
  return response.data
}
