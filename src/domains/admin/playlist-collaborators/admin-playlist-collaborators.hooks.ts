'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchPlaylistCollaborators } from './admin-playlist-collaborators.actions'
import { addCollaborator, removeCollaborator } from './admin-playlist-collaborators.client'
import type { AddCollaboratorAdminInput } from './admin-playlist-collaborators.types'

export function usePlaylistCollaborators(playlistId: string | null) {
  return useQuery({
    queryKey: ['admin', 'playlist-collaborators', playlistId],
    queryFn: () => fetchPlaylistCollaborators(playlistId as string),
    enabled: !!playlistId,
  })
}

export function useAddCollaborator(playlistId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AddCollaboratorAdminInput) => addCollaborator(playlistId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'playlist-collaborators', playlistId] })
      toast.success('Colaborador agregado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al agregar el colaborador'),
  })
}

export function useRemoveCollaborator(playlistId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (guestId: string) => removeCollaborator(playlistId, guestId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'playlist-collaborators', playlistId] })
      toast.success('Colaborador eliminado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar el colaborador'),
  })
}

export const adminPlaylistCollaboratorsHooks = {
  usePlaylistCollaborators,
  useAddCollaborator,
  useRemoveCollaborator,
}
