'use client'

import { useState } from 'react'
import { adminAuditLogHooks } from '@/src/domains/admin/readonly/audit-log/admin-audit-log.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import type { AdminAuditLogDto } from '@/src/domains/admin/readonly/audit-log/admin-audit-log.types'

export default function AdminAuditLogPage() {
  const [page, setPage] = useState(1)
  const limit = 15

  const { data, isLoading, error } = adminAuditLogHooks.useAdminAuditLog(page, limit)

  const columns: ColumnDef<AdminAuditLogDto>[] = [
    {
      key: 'action',
      header: 'Acción',
      width: '2fr',
      render: (row) => <span className="text-sm font-semibold">{row.action}</span>,
    },
    {
      key: 'userId',
      header: 'Usuario',
      width: '2fr',
      render: (row) => <span className="text-xs font-mono text-muted-foreground">{row.userId}</span>,
    },
    {
      key: 'ipAddress',
      header: 'IP',
      width: '130px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.ipAddress ?? '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      width: '150px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight">Auditoría</h2>
        <p className="text-sm text-muted-foreground">
          {data?.total ?? '—'} eventos registrados — solo lectura, registro inmutable
        </p>
      </div>

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
