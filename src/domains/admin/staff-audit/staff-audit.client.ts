'use client'

import { apiClient } from '@/src/shared/libs/axios/axios-client'
import { apiURLs } from '@/src/shared/constants/urls'
import type { StaffAuditExportFormat, StaffAuditLogFilters } from './staff-audit.types'

const CONTENT_TYPE_BY_FORMAT: Record<StaffAuditExportFormat, string> = {
  csv: 'text/csv',
  pdf: 'application/pdf',
}

export async function exportStaffAuditLog(
  format: StaffAuditExportFormat,
  filters: StaffAuditLogFilters = {},
): Promise<void> {
  const response = await apiClient.get(apiURLs.staff.auditLog.export, {
    params: { format, ...filters },
    responseType: 'blob',
  })

  const blob = new Blob([response.data], { type: CONTENT_TYPE_BY_FORMAT[format] })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `auditoria-staff-${new Date().toISOString().slice(0, 10)}.${format}`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
