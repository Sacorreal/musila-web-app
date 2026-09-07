'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchStaffAuditLog } from './staff-audit.actions'
import { exportStaffAuditLog } from './staff-audit.client'
import type { StaffAuditExportFormat, StaffAuditLogFilters } from './staff-audit.types'

export function useStaffAuditLog(page = 1, limit = 20, filters: StaffAuditLogFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'staff-audit-log', page, limit, filters],
    queryFn: () => fetchStaffAuditLog(page, limit, filters),
  })
}

export function useExportStaffAuditLog() {
  return useMutation({
    mutationFn: ({ format, filters }: { format: StaffAuditExportFormat; filters?: StaffAuditLogFilters }) =>
      exportStaffAuditLog(format, filters),
    onSuccess: () => toast.success('Exportación descargada'),
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al exportar el registro de auditoría'),
  })
}

export const staffAuditHooks = {
  useStaffAuditLog,
  useExportStaffAuditLog,
}
