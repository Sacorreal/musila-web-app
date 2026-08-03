'use client'

import { apiClient } from '@shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { BlogArticleDto, CreateBlogArticleInput, UpdateBlogArticleInput } from '../shared/blog.types'

export async function createBlogArticle(input: CreateBlogArticleInput): Promise<BlogArticleDto> {
  const response = await apiClient.post<BlogArticleDto>(apiURLs.blog.admin.articles.base, input)
  return response.data
}

export async function updateBlogArticle(id: string, input: UpdateBlogArticleInput): Promise<BlogArticleDto> {
  const response = await apiClient.put<BlogArticleDto>(apiURLs.blog.admin.articles.byId(id), input)
  return response.data
}

export async function publishBlogArticle(id: string): Promise<BlogArticleDto> {
  const response = await apiClient.patch<BlogArticleDto>(apiURLs.blog.admin.articles.publish(id))
  return response.data
}

export async function unpublishBlogArticle(id: string): Promise<BlogArticleDto> {
  const response = await apiClient.patch<BlogArticleDto>(apiURLs.blog.admin.articles.unpublish(id))
  return response.data
}

export async function deleteBlogArticle(id: string): Promise<void> {
  await apiClient.delete(apiURLs.blog.admin.articles.byId(id))
}
