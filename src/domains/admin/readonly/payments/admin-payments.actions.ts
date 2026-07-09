'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminPaymentFilters, PaginatedAdminPayments } from './admin-payments.types'

export async function fetchAdminPayments(
  page = 1,
  limit = 10,
  filters: AdminPaymentFilters = {},
): Promise<PaginatedAdminPayments> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset, ...filters }
  const response = await client.get<PaginatedAdminPayments>(apiURLs.paymentsAdmin.base, { params })
  return response.data
}
