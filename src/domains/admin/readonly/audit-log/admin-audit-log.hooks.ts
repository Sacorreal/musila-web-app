'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchAdminAuditLog } from './admin-audit-log.actions'
import type { AdminAuditLogFilters } from './admin-audit-log.types'

export function useAdminAuditLog(page = 1, limit = 10, filters: AdminAuditLogFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'audit-log', page, limit, filters],
    queryFn: () => fetchAdminAuditLog(page, limit, filters),
  })
}

export const adminAuditLogHooks = { useAdminAuditLog }
