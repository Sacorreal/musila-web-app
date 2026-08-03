'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedResponse } from '@shared/types/shared.types'
import type { BlogTagDto } from '../shared/blog.types'

export async function fetchAdminBlogTags(page = 1, limit = 20): Promise<PaginatedResponse<BlogTagDto>> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedResponse<BlogTagDto>>(apiURLs.blog.admin.tags.base, {
    params: { limit, offset },
  })
  return response.data
}
