'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedAdminIntellectualProperty } from './admin-ip.types'

export async function fetchAdminIntellectualProperty(page = 1, limit = 10): Promise<PaginatedAdminIntellectualProperty> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedAdminIntellectualProperty>(apiURLs.intellectualProperty.base, {
    params: { limit, offset },
  })
  return response.data
}
