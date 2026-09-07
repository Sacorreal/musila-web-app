'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminIntellectualProperty } from './admin-ip.actions'
import { createIntellectualProperty, deleteIntellectualProperty, updateIntellectualProperty } from './admin-ip.client'
import type { CreateIntellectualPropertyAdminInput, UpdateIntellectualPropertyAdminInput } from './admin-ip.types'

export function useAdminIntellectualProperty(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['admin', 'intellectual-property', page, limit],
    queryFn: () => fetchAdminIntellectualProperty(page, limit),
  })
}

export function useCreateIntellectualProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateIntellectualPropertyAdminInput) => createIntellectualProperty(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'intellectual-property'] })
      toast.success('Registro creado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear el registro'),
  })
}

export function useUpdateIntellectualProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateIntellectualPropertyAdminInput }) =>
      updateIntellectualProperty(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'intellectual-property'] })
      toast.success('Registro actualizado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar el registro'),
  })
}

export function useDeleteIntellectualProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteIntellectualProperty(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'intellectual-property'] })
      toast.success('Registro eliminado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar el registro'),
  })
}

export const adminIpHooks = {
  useAdminIntellectualProperty,
  useCreateIntellectualProperty,
  useUpdateIntellectualProperty,
  useDeleteIntellectualProperty,
}
