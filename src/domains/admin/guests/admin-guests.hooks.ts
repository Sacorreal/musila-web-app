'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminGuests } from './admin-guests.actions'
import { createGuest, deleteGuest, updateGuest } from './admin-guests.client'
import type { AdminGuestFilters, CreateGuestAdminInput, UpdateGuestAdminInput } from './admin-guests.types'

export function useAdminGuests(page = 1, limit = 10, filters: AdminGuestFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'guests', page, limit, filters],
    queryFn: () => fetchAdminGuests(page, limit, filters),
  })
}

export function useCreateGuest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateGuestAdminInput) => createGuest(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'guests'] })
      toast.success('Invitado creado correctamente')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear el invitado'),
  })
}

export function useUpdateGuest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGuestAdminInput }) => updateGuest(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'guests'] })
      toast.success('Invitado actualizado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar el invitado'),
  })
}

export function useDeleteGuest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGuest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'guests'] })
      toast.success('Invitado eliminado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar el invitado'),
  })
}

export const adminGuestsHooks = {
  useAdminGuests,
  useCreateGuest,
  useUpdateGuest,
  useDeleteGuest,
}
