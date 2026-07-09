'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedAdminPendingRegistrations } from './admin-pending-registrations.types'

export async function fetchAdminPendingRegistrations(page = 1, limit = 10): Promise<PaginatedAdminPendingRegistrations> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedAdminPendingRegistrations>(apiURLs.paymentsAdmin.pendingRegistrations, {
    params: { limit, offset },
  })
  return response.data
}
