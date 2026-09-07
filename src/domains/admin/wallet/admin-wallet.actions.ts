'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminWalletFilters, PaginatedAdminWithdrawals } from './admin-wallet.types'

export async function fetchAdminWithdrawals(
  page = 1,
  limit = 10,
  filters: AdminWalletFilters = {},
): Promise<PaginatedAdminWithdrawals> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset }
  if (filters.status) params.status = filters.status
  if (filters.userId) params.userId = filters.userId
  const response = await client.get<PaginatedAdminWithdrawals>(apiURLs.wallet.admin.withdrawals, { params })
  return response.data
}
