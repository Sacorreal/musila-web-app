'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminBlogTags } from './admin-blog-tags.actions'
import { createBlogTag, deleteBlogTag, updateBlogTag } from './admin-blog-tags.client'
import type { CreateBlogTagInput, UpdateBlogTagInput } from '../shared/blog.types'

export function useAdminBlogTags(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['admin', 'blog', 'tags', page, limit],
    queryFn: () => fetchAdminBlogTags(page, limit),
  })
}

export function useCreateBlogTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBlogTagInput) => createBlogTag(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'tags'] })
      toast.success('Etiqueta creada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear la etiqueta'),
  })
}

export function useUpdateBlogTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBlogTagInput }) => updateBlogTag(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'tags'] })
      toast.success('Etiqueta actualizada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar la etiqueta'),
  })
}

export function useDeleteBlogTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBlogTag(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'tags'] })
      toast.success('Etiqueta eliminada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar la etiqueta'),
  })
}

export const adminBlogTagsHooks = {
  useAdminBlogTags,
  useCreateBlogTag,
  useUpdateBlogTag,
  useDeleteBlogTag,
}
