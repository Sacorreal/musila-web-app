'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchStaffPermissions, fetchStaffRoleById, fetchStaffRoles } from './staff-roles.actions'
import { createStaffRole, deleteStaffRole, updateStaffRole } from './staff-roles.client'
import type { CreateStaffRoleInput, StaffRoleFilters, UpdateStaffRoleInput } from './staff-roles.types'

export function useStaffPermissions() {
  return useQuery({
    queryKey: ['admin', 'staff-permissions'],
    queryFn: () => fetchStaffPermissions(),
    staleTime: 5 * 60 * 1000, // el catálogo de permisos es prácticamente estático (se siembra por migración)
  })
}

export function useStaffRoles(page = 1, limit = 20, filters: StaffRoleFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'staff-roles', page, limit, filters],
    queryFn: () => fetchStaffRoles(page, limit, filters),
  })
}

export function useStaffRole(id?: string) {
  return useQuery({
    queryKey: ['admin', 'staff-roles', id],
    queryFn: () => fetchStaffRoleById(id!),
    enabled: !!id,
  })
}

export function useCreateStaffRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateStaffRoleInput) => createStaffRole(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'staff-roles'] })
      toast.success('Rol interno creado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear el rol'),
  })
}

export function useUpdateStaffRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStaffRoleInput }) => updateStaffRole(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'staff-roles'] })
      toast.success('Rol interno actualizado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar el rol'),
  })
}

export function useDeleteStaffRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteStaffRole(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'staff-roles'] })
      toast.success('Rol interno eliminado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar el rol'),
  })
}

export const staffRolesHooks = {
  useStaffPermissions,
  useStaffRoles,
  useStaffRole,
  useCreateStaffRole,
  useUpdateStaffRole,
  useDeleteStaffRole,
}
