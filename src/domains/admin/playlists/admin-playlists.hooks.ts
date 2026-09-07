'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminPlaylistById, fetchAdminPlaylists } from './admin-playlists.actions'
import { createPlaylist, deletePlaylist, updatePlaylist } from './admin-playlists.client'
import type { CreatePlaylistAdminInput, UpdatePlaylistAdminInput } from './admin-playlists.types'

export function useAdminPlaylists(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['admin', 'playlists', page, limit],
    queryFn: () => fetchAdminPlaylists(page, limit),
  })
}

export function useAdminPlaylist(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'playlists', 'detail', id],
    queryFn: () => fetchAdminPlaylistById(id as string),
    enabled: !!id,
  })
}

export function useCreatePlaylist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatePlaylistAdminInput) => createPlaylist(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'playlists'] })
      toast.success('Playlist creada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear la playlist'),
  })
}

export function useUpdatePlaylist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePlaylistAdminInput }) => updatePlaylist(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'playlists'] })
      toast.success('Playlist actualizada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar la playlist'),
  })
}

export function useDeletePlaylist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePlaylist(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'playlists'] })
      toast.success('Playlist eliminada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar la playlist'),
  })
}

export const adminPlaylistsHooks = {
  useAdminPlaylists,
  useAdminPlaylist,
  useCreatePlaylist,
  useUpdatePlaylist,
  useDeletePlaylist,
}
