'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminInviteFilters, PaginatedAdminInvites } from './admin-invites.types'

export async function fetchAdminInvites(
  page = 1,
  limit = 10,
  filters: AdminInviteFilters = {},
): Promise<PaginatedAdminInvites> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset }
  if (filters.isUsed !== undefined) params.isUsed = filters.isUsed
  if (filters.email) params.email = filters.email
  const response = await client.get<PaginatedAdminInvites>(apiURLs.invites.admin.base, { params })
  return response.data
}
