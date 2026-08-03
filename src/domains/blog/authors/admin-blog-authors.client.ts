'use client'

import { apiClient } from '@shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { BlogAuthorDto, CreateBlogAuthorInput, UpdateBlogAuthorInput } from '../shared/blog.types'

export async function createBlogAuthor(input: CreateBlogAuthorInput): Promise<BlogAuthorDto> {
  const response = await apiClient.post<BlogAuthorDto>(apiURLs.blog.admin.authors.base, input)
  return response.data
}

export async function updateBlogAuthor(id: string, input: UpdateBlogAuthorInput): Promise<BlogAuthorDto> {
  const response = await apiClient.put<BlogAuthorDto>(apiURLs.blog.admin.authors.byId(id), input)
  return response.data
}

export async function deleteBlogAuthor(id: string): Promise<void> {
  await apiClient.delete(apiURLs.blog.admin.authors.byId(id))
}
