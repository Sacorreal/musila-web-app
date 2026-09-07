'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteRequestedTrack, updateRequestedTrack } from './admin-requested-tracks.client'
import type { UpdateRequestedTrackAdminInput } from './admin-requested-tracks.types'

export function useUpdateRequestedTrack() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRequestedTrackAdminInput }) =>
      updateRequestedTrack(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'requests'] })
      toast.success('Solicitud actualizada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar la solicitud'),
  })
}

export function useDeleteRequestedTrack() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRequestedTrack(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'requests'] })
      toast.success('Solicitud eliminada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar la solicitud'),
  })
}

export const adminRequestedTracksHooks = {
  useUpdateRequestedTrack,
  useDeleteRequestedTrack,
}
