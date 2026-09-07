'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminNotificationDto, CreateNotificationAdminInput } from './admin-notifications.types'

export async function createNotification(input: CreateNotificationAdminInput): Promise<AdminNotificationDto> {
  const response = await apiClient.post<AdminNotificationDto>(apiURLs.notifications.admin.base, input)
  return response.data
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(apiURLs.notifications.admin.byId(id))
}
