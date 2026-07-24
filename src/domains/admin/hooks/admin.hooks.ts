'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UserPlanType, MusicRole } from '@/src/domains/users/types/user.types'
import {
  fetchAdminStats,
  fetchAllUsers,
  fetchAllTracks,
  fetchAllGenres,
  fetchAllRequests,
  createAdminUser,
} from '../services/admin.actions'
import type { TrackFilters, UserFilters } from '../types/admin.types'
import {
  deleteUser,
  updatePlanType,
  updateUserMusicRole,
  deleteTrack,
  deleteGenre,
  createGenre,
  updateGenre,
} from '../services/admin.client'
import type { CreateAdminUserInput, CreateGenreInput, UpdateGenreInput } from '../types/admin.types'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchAdminStats,
  })
}

export function useAdminUsers(page = 1, limit = 10, filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', page, limit, filters],
    queryFn: () => fetchAllUsers(page, limit, filters),
  })
}

export function useAdminTracks(page = 1, limit = 10, filters: TrackFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'tracks', page, limit, filters],
    queryFn: () => fetchAllTracks(page, limit, filters),
  })
}

export function useAdminGenres(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['admin', 'genres', page, limit],
    queryFn: () => fetchAllGenres(page, limit),
  })
}

export function useAdminRequests(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['admin', 'requests', page, limit],
    queryFn: () => fetchAllRequests(page, limit),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Usuario eliminado')
    },
    onError: () => toast.error('Error al eliminar el usuario'),
  })
}

export function useUpdatePlanType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, planType }: { id: string; planType: UserPlanType }) => updatePlanType(id, planType),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Plan actualizado')
    },
    onError: () => toast.error('Error al actualizar el plan'),
  })
}

export function useUpdateUserMusicRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: MusicRole }) => updateUserMusicRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Rol actualizado')
    },
    onError: () => toast.error('Error al actualizar el rol'),
  })
}

export function useDeleteTrack() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTrack(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tracks'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Track eliminado')
    },
    onError: () => toast.error('Error al eliminar el track'),
  })
}

export function useDeleteGenre() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGenre(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'genres'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Género eliminado')
    },
    onError: () => toast.error('Error al eliminar el género'),
  })
}

export function useCreateGenre() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateGenreInput) => createGenre(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'genres'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Género creado')
    },
    onError: () => toast.error('Error al crear el género'),
  })
}

export function useUpdateGenre() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGenreInput }) => updateGenre(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'genres'] })
      toast.success('Género actualizado')
    },
    onError: () => toast.error('Error al actualizar el género'),
  })
}

export function useCreateAdminUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAdminUserInput) => createAdminUser(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Administrador creado correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Error al crear el administrador')
    },
  })
}

export const adminHooks = {
  useAdminStats,
  useAdminUsers,
  useAdminTracks,
  useAdminGenres,
  useAdminRequests,
  useDeleteUser,
  useUpdatePlanType,
  useUpdateUserMusicRole,
  useDeleteTrack,
  useDeleteGenre,
  useCreateGenre,
  useUpdateGenre,
  useCreateAdminUser,
}
