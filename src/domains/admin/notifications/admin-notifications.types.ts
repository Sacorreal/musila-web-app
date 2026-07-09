import { PaginatedResponse } from '@shared/types/shared.types'

export interface AdminNotificationDto {
  id: string
  title: string
  message: string
  type: string
  link?: string
  isRead: boolean
  data?: Record<string, unknown>
  recipient?: { id: string; name: string; lastName: string; email: string }
  createdAt: string
}

export interface CreateNotificationAdminInput {
  recipientId: string
  title: string
  message: string
  type?: string
  link?: string
}

export interface AdminNotificationFilters {
  recipientId?: string
  type?: string
  isRead?: boolean
}

export type PaginatedAdminNotifications = PaginatedResponse<AdminNotificationDto>
