'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useUploadStorage } from '@/src/domains/storage/hooks/use-upload-storage'
import { StorageFolder } from '@/src/domains/storage/types/storage.types'
import { fetchAdminBlogArticleById, fetchAdminBlogArticles } from './admin-blog-articles.actions'
import {
  createBlogArticle,
  deleteBlogArticle,
  publishBlogArticle,
  unpublishBlogArticle,
  updateBlogArticle,
} from './admin-blog-articles.client'
import type { BlogArticleFormValues } from './blog-article.schema'
import type { BlogArticleAdminFilters, CreateBlogArticleInput, UpdateBlogArticleInput } from '../shared/blog.types'

export function useAdminBlogArticles(page = 1, limit = 10, filters: BlogArticleAdminFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'blog', 'articles', page, limit, filters],
    queryFn: () => fetchAdminBlogArticles(page, limit, filters),
  })
}

export function useAdminBlogArticle(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'blog', 'articles', 'detail', id],
    queryFn: () => fetchAdminBlogArticleById(id as string),
    enabled: !!id,
  })
}

export function useCreateBlogArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBlogArticleInput) => createBlogArticle(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'articles'] })
      toast.success('Artículo creado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear el artículo'),
  })
}

export function useUpdateBlogArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBlogArticleInput }) => updateBlogArticle(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'articles'] })
      toast.success('Artículo actualizado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar el artículo'),
  })
}

export function usePublishBlogArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => publishBlogArticle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'articles'] })
      toast.success('Artículo publicado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al publicar el artículo'),
  })
}

export function useUnpublishBlogArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unpublishBlogArticle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'articles'] })
      toast.success('Artículo pasado a borrador')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar el artículo'),
  })
}

export function useDeleteBlogArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBlogArticle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'articles'] })
      toast.success('Artículo eliminado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar el artículo'),
  })
}

/** Orquesta: sube la imagen destacada (si hay una nueva) y luego crea el artículo con la key/url resultante. */
export function useCreateBlogArticleWithUpload() {
  const qc = useQueryClient()
  const { mutateAsync: uploadFiles, rollback, progresses } = useUploadStorage()

  const mutation = useMutation({
    mutationFn: async (data: BlogArticleFormValues) => {
      const { coverFile, ...rest } = data
      const uploaded = coverFile
        ? (await uploadFiles([{ field: 'blogArticleCover', file: coverFile, folder: StorageFolder.BLOG_ARTICLE_COVER }]))[0]
        : undefined

      const payload: CreateBlogArticleInput = {
        ...rest,
        youtubeUrl: rest.youtubeUrl || undefined,
        coverImageUrl: uploaded?.publicUrl,
        coverImageKey: uploaded?.key,
      }

      try {
        return await createBlogArticle(payload)
      } catch (error) {
        if (uploaded) await rollback([uploaded.key])
        throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'articles'] })
      toast.success('Artículo creado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear el artículo'),
  })

  return { ...mutation, uploadProgress: progresses.blogArticleCover ?? 0 }
}

/** Igual que la creación, pero solo sube una nueva imagen si el admin adjuntó un archivo distinto al existente. */
export function useUpdateBlogArticleWithUpload(id: string) {
  const qc = useQueryClient()
  const { mutateAsync: uploadFiles, rollback, progresses } = useUploadStorage()

  const mutation = useMutation({
    mutationFn: async (data: Partial<BlogArticleFormValues>) => {
      const { coverFile, ...rest } = data
      const uploaded = coverFile
        ? (await uploadFiles([{ field: 'blogArticleCover', file: coverFile, folder: StorageFolder.BLOG_ARTICLE_COVER }]))[0]
        : undefined

      const payload: UpdateBlogArticleInput = {
        ...rest,
        youtubeUrl: rest.youtubeUrl || undefined,
        ...(uploaded && { coverImageUrl: uploaded.publicUrl, coverImageKey: uploaded.key }),
      }

      try {
        return await updateBlogArticle(id, payload)
      } catch (error) {
        if (uploaded) await rollback([uploaded.key])
        throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'articles'] })
      toast.success('Artículo actualizado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar el artículo'),
  })

  return { ...mutation, uploadProgress: progresses.blogArticleCover ?? 0 }
}

export const adminBlogArticlesHooks = {
  useAdminBlogArticles,
  useAdminBlogArticle,
  useCreateBlogArticle,
  useUpdateBlogArticle,
  useCreateBlogArticleWithUpload,
  useUpdateBlogArticleWithUpload,
  usePublishBlogArticle,
  useUnpublishBlogArticle,
  useDeleteBlogArticle,
}
