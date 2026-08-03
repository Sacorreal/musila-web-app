'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedResponse } from '@shared/types/shared.types'
import type { BlogArticleDto, BlogArticlePublicFilters } from '../shared/blog.types'

export async function fetchPublicArticles(
  page = 1,
  limit = 12,
  filters: BlogArticlePublicFilters = {},
): Promise<PaginatedResponse<BlogArticleDto>> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedResponse<BlogArticleDto>>(apiURLs.blog.articles.base, {
    params: { limit, offset, ...filters },
  })
  return response.data
}

export async function fetchArticleBySlug(slug: string): Promise<BlogArticleDto | null> {
  const client = await getServerApiClient()
  try {
    const response = await client.get<BlogArticleDto>(apiURLs.blog.articles.bySlug(slug))
    return response.data
  } catch {
    return null
  }
}
