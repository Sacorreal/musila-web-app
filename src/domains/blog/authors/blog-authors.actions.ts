'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedResponse } from '@shared/types/shared.types'
import type { BlogArticleDto, BlogAuthorDto } from '../shared/blog.types'

export async function fetchAuthorBySlug(slug: string): Promise<BlogAuthorDto | null> {
  const client = await getServerApiClient()
  try {
    const response = await client.get<BlogAuthorDto>(apiURLs.blog.authors.bySlug(slug))
    return response.data
  } catch {
    return null
  }
}

export async function fetchAuthorArticles(slug: string, page = 1, limit = 9): Promise<PaginatedResponse<BlogArticleDto>> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const response = await client.get<PaginatedResponse<BlogArticleDto>>(apiURLs.blog.authors.articlesBySlug(slug), {
    params: { limit, offset },
  })
  return response.data
}
