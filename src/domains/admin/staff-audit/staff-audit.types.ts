import { PaginatedResponse } from '@shared/types/shared.types'

export type StaffAuditOutcome = 'success' | 'failure'

export interface StaffAuditLogDto {
  id: string
  actorUserId: string
  actorName: string
  actorRoleName?: string
  module: string
  action: string
  httpMethod?: string
  route?: string
  entityType?: string
  entityId?: string
  statusCode?: number
  outcome: StaffAuditOutcome
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
  durationMs?: number
  createdAt: string
}

export interface StaffAuditLogFilters {
  dateFrom?: string
  dateTo?: string
  module?: string
  action?: string
  actorUserId?: string
}

export type PaginatedStaffAuditLog = PaginatedResponse<StaffAuditLogDto> & {
  limit: number
  offset: number
  oldestAvailableRecordAt?: string
}

export type StaffAuditExportFormat = 'csv' | 'pdf'
