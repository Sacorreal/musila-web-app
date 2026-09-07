'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedResponse } from '@shared/types/shared.types'
import type { BlogArticleAdminFilters, BlogArticleDto } from '../shared/blog.types'

export async function fetchAdminBlogArticles(
  page = 1,
  limit = 10,
  filters: BlogArticleAdminFilters = {},
): Promise<PaginatedResponse<BlogArticleDto>> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedResponse<BlogArticleDto>>(apiURLs.blog.admin.articles.base, {
    params: { limit, offset, ...filters },
  })
  return response.data
}

export async function fetchAdminBlogArticleById(id: string): Promise<BlogArticleDto> {
  const client = await getServerApiClient()
  const response = await client.get<BlogArticleDto>(apiURLs.blog.admin.articles.byId(id))
  return response.data
}
