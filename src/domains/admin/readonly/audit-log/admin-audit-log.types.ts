import { PaginatedResponse } from '@shared/types/shared.types'

export interface AdminAuditLogDto {
  id: string
  userId: string
  action: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  createdAt: string
}

export interface AdminAuditLogFilters {
  userId?: string
  action?: string
}

export type PaginatedAdminAuditLog = PaginatedResponse<AdminAuditLogDto>
