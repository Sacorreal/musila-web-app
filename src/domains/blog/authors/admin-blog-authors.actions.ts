'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedResponse } from '@shared/types/shared.types'
import type { BlogAuthorDto } from '../shared/blog.types'

export async function fetchAdminBlogAuthors(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<BlogAuthorDto>> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedResponse<BlogAuthorDto>>(apiURLs.blog.admin.authors.base, {
    params: { limit, offset, ...(search && { search }) },
  })
  return response.data
}

export async function fetchAdminBlogAuthorById(id: string): Promise<BlogAuthorDto> {
  const client = await getServerApiClient()
  const response = await client.get<BlogAuthorDto>(apiURLs.blog.admin.authors.byId(id))
  return response.data
}
