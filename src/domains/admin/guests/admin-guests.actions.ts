'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminGuestFilters, PaginatedAdminGuests } from './admin-guests.types'

export async function fetchAdminGuests(
  page = 1,
  limit = 10,
  filters: AdminGuestFilters = {},
): Promise<PaginatedAdminGuests> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset }
  if (filters.search) params.search = filters.search
  const response = await client.get<PaginatedAdminGuests>(apiURLs.guests.base, { params })
  return response.data
}
