'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminNotificationFilters, PaginatedAdminNotifications } from './admin-notifications.types'

export async function fetchAdminNotifications(
  page = 1,
  limit = 10,
  filters: AdminNotificationFilters = {},
): Promise<PaginatedAdminNotifications> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset }
  if (filters.recipientId) params.recipientId = filters.recipientId
  if (filters.type) params.type = filters.type
  if (filters.isRead !== undefined) params.isRead = filters.isRead
  const response = await client.get<PaginatedAdminNotifications>(apiURLs.notifications.admin.base, { params })
  return response.data
}
