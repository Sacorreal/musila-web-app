'use client'

import { apiClient } from '@shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { BlogTagDto, CreateBlogTagInput, UpdateBlogTagInput } from '../shared/blog.types'

export async function createBlogTag(input: CreateBlogTagInput): Promise<BlogTagDto> {
  const response = await apiClient.post<BlogTagDto>(apiURLs.blog.admin.tags.base, input)
  return response.data
}

export async function updateBlogTag(id: string, input: UpdateBlogTagInput): Promise<BlogTagDto> {
  const response = await apiClient.put<BlogTagDto>(apiURLs.blog.admin.tags.byId(id), input)
  return response.data
}

export async function deleteBlogTag(id: string): Promise<void> {
  await apiClient.delete(apiURLs.blog.admin.tags.byId(id))
}
