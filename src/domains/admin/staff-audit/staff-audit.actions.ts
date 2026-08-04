'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { PaginatedStaffAuditLog, StaffAuditLogFilters } from './staff-audit.types'

export async function fetchStaffAuditLog(
  page = 1,
  limit = 20,
  filters: StaffAuditLogFilters = {},
): Promise<PaginatedStaffAuditLog> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset, ...filters }
  const response = await client.get<PaginatedStaffAuditLog>(apiURLs.staff.auditLog.base, { params })
  return response.data
}
