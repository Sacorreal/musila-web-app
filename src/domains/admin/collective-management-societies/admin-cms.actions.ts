'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedAdminCollectiveManagementSociety } from './admin-cms.types'

export async function fetchAdminCollectiveManagementSocieties(
  page = 1,
  limit = 10,
  search?: string,
): Promise<PaginatedAdminCollectiveManagementSociety> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedAdminCollectiveManagementSociety>(
    apiURLs.referenceData.collectiveManagementSocieties.base,
    { params: { limit, offset, search } },
  )
  return response.data
}
