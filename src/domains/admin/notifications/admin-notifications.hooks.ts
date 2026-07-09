'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminNotifications } from './admin-notifications.actions'
import { createNotification, deleteNotification } from './admin-notifications.client'
import type { AdminNotificationFilters, CreateNotificationAdminInput } from './admin-notifications.types'

export function useAdminNotifications(page = 1, limit = 10, filters: AdminNotificationFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'notifications', page, limit, filters],
    queryFn: () => fetchAdminNotifications(page, limit, filters),
  })
}

export function useCreateNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateNotificationAdminInput) => createNotification(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'notifications'] })
      toast.success('Notificación enviada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al enviar la notificación'),
  })
}

export function useDeleteNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'notifications'] })
      toast.success('Notificación eliminada')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar la notificación'),
  })
}

export const adminNotificationsHooks = {
  useAdminNotifications,
  useCreateNotification,
  useDeleteNotification,
}
