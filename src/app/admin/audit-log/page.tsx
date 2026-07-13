'use client'

import { useState } from 'react'
import { adminAuditLogHooks } from '@/src/domains/admin/readonly/audit-log/admin-audit-log.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { getAuditLogColumns } from './audit-log-columns'

export default function AdminAuditLogPage() {
  const [page, setPage] = useState(1)
  const limit = 15

  const { data, isLoading, error } = adminAuditLogHooks.useAdminAuditLog(page, limit)

  const columns = getAuditLogColumns()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoría"
        description={`${data?.total ?? '—'} eventos registrados — solo lectura, registro inmutable`}
      />

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
