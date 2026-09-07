'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useUploadStorage } from '@/src/domains/storage/hooks/use-upload-storage'
import { StorageFolder } from '@/src/domains/storage/types/storage.types'
import { fetchAdminBlogAuthorById, fetchAdminBlogAuthors } from './admin-blog-authors.actions'
import { createBlogAuthor, deleteBlogAuthor, updateBlogAuthor } from './admin-blog-authors.client'
import type { BlogAuthorFormValues } from './blog-author.schema'
import type { CreateBlogAuthorInput, UpdateBlogAuthorInput } from '../shared/blog.types'

export function useAdminBlogAuthors(page = 1, limit = 10, search?: string) {
  return useQuery({
    queryKey: ['admin', 'blog', 'authors', page, limit, search],
    queryFn: () => fetchAdminBlogAuthors(page, limit, search),
  })
}

export function useAdminBlogAuthor(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'blog', 'authors', 'detail', id],
    queryFn: () => fetchAdminBlogAuthorById(id as string),
    enabled: !!id,
  })
}

export function useCreateBlogAuthor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBlogAuthorInput) => createBlogAuthor(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'authors'] })
      toast.success('Autor creado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear el autor'),
  })
}

export function useUpdateBlogAuthor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBlogAuthorInput }) => updateBlogAuthor(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'authors'] })
      toast.success('Autor actualizado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar el autor'),
  })
}

export function useDeleteBlogAuthor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBlogAuthor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'authors'] })
      toast.success('Autor eliminado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar el autor'),
  })
}

/** Orquesta: sube la foto de perfil (si hay una nueva) y luego crea el autor con la key/url resultante. */
export function useCreateBlogAuthorWithUpload() {
  const qc = useQueryClient()
  const { mutateAsync: uploadFiles, rollback, progresses } = useUploadStorage()

  const mutation = useMutation({
    mutationFn: async (data: BlogAuthorFormValues) => {
      const { avatarFile, ...rest } = data
      const uploaded = avatarFile
        ? (await uploadFiles([{ field: 'blogAuthorAvatar', file: avatarFile, folder: StorageFolder.BLOG_AUTHOR_AVATAR }]))[0]
        : undefined

      const payload: CreateBlogAuthorInput = {
        ...rest,
        avatarUrl: uploaded?.publicUrl,
        avatarKey: uploaded?.key,
      }

      try {
        return await createBlogAuthor(payload)
      } catch (error) {
        if (uploaded) await rollback([uploaded.key])
        throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'authors'] })
      toast.success('Autor creado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear el autor'),
  })

  return { ...mutation, uploadProgress: progresses.blogAuthorAvatar ?? 0 }
}

/** Igual que la creación, pero solo sube una nueva foto si el admin adjuntó un archivo. */
export function useUpdateBlogAuthorWithUpload(id: string) {
  const qc = useQueryClient()
  const { mutateAsync: uploadFiles, rollback, progresses } = useUploadStorage()

  const mutation = useMutation({
    mutationFn: async (data: Partial<BlogAuthorFormValues>) => {
      const { avatarFile, ...rest } = data
      const uploaded = avatarFile
        ? (await uploadFiles([{ field: 'blogAuthorAvatar', file: avatarFile, folder: StorageFolder.BLOG_AUTHOR_AVATAR }]))[0]
        : undefined

      const payload: UpdateBlogAuthorInput = {
        ...rest,
        ...(uploaded && { avatarUrl: uploaded.publicUrl, avatarKey: uploaded.key }),
      }

      try {
        return await updateBlogAuthor(id, payload)
      } catch (error) {
        if (uploaded) await rollback([uploaded.key])
        throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog', 'authors'] })
      toast.success('Autor actualizado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar el autor'),
  })

  return { ...mutation, uploadProgress: progresses.blogAuthorAvatar ?? 0 }
}

export const adminBlogAuthorsHooks = {
  useAdminBlogAuthors,
  useAdminBlogAuthor,
  useCreateBlogAuthor,
  useUpdateBlogAuthor,
  useCreateBlogAuthorWithUpload,
  useUpdateBlogAuthorWithUpload,
  useDeleteBlogAuthor,
}
