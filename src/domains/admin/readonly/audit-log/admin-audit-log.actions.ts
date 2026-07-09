'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { AdminAuditLogFilters, PaginatedAdminAuditLog } from './admin-audit-log.types'

export async function fetchAdminAuditLog(
  page = 1,
  limit = 10,
  filters: AdminAuditLogFilters = {},
): Promise<PaginatedAdminAuditLog> {
  const client = await getServerApiClient()
  const offset = (page - 1) * limit
  const params: Record<string, unknown> = { limit, offset, ...filters }
  const response = await client.get<PaginatedAdminAuditLog>(apiURLs.admin.auditLog, { params })
  return response.data
}
