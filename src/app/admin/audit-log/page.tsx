'use client'

import { useEffect, useState } from 'react'
import { FileDown, FileText } from 'lucide-react'
import { staffAuditHooks } from '@/src/domains/admin/staff-audit/staff-audit.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { AuditLogFiltersToolbar } from './audit-log-filters-toolbar'
import { getAuditLogColumns } from './audit-log-columns'
import type { StaffAuditLogFilters } from '@/src/domains/admin/staff-audit/staff-audit.types'

export default function AdminAuditLogPage() {
  const [page, setPage] = useState(1)
  const limit = 15

  const [module, setModule] = useState('')
  const [action, setAction] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filters: StaffAuditLogFilters = {
    ...(module && { module }),
    ...(action && { action }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  }
  const hasActiveFilters = !!(module || action || dateFrom || dateTo)

  useEffect(() => { setPage(1) }, [module, action, dateFrom, dateTo])

  const { data, isLoading, error } = staffAuditHooks.useStaffAuditLog(page, limit, filters)
  const { mutate: exportAuditLog, isPending: isExporting } = staffAuditHooks.useExportStaffAuditLog()

  const columns = getAuditLogColumns()

  const clearFilters = () => {
    setModule('')
    setAction('')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoría de staff"
        description={`${data?.total ?? '—'} eventos registrados — registro inmutable, retención mínima de 90 días`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isExporting}
              onClick={() => exportAuditLog({ format: 'csv', filters })}
            >
              <FileDown className="h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isExporting}
              onClick={() => exportAuditLog({ format: 'pdf', filters })}
            >
              <FileText className="h-4 w-4" />
              PDF
            </Button>
          </div>
        }
      />

      <AuditLogFiltersToolbar
        module={module}
        onModuleChange={setModule}
        action={action}
        onActionChange={setAction}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {data?.oldestAvailableRecordAt && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-400">
          El rango solicitado excede el histórico disponible. El registro más antiguo es del{' '}
          {new Date(data.oldestAvailableRecordAt).toLocaleDateString('es-ES')}.
        </p>
      )}

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar el registro de auditoría' : null}
        emptyMessage="No hay eventos de auditoría registrados"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />
    </div>
  )
}
