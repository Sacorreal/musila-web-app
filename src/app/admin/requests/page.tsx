'use client'

import { useState } from 'react'
import { adminHooks } from '@/src/domains/admin/hooks/admin.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import type { AdminRequestDto } from '@/src/domains/admin/types/admin.types'

const STATUS_STYLES: Record<string, string> = {
  pendiente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  aprobada: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rechazada: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  cancelada: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

export default function AdminRequestsPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading, error } = adminHooks.useAdminRequests(page, limit)

  const columns: ColumnDef<AdminRequestDto>[] = [
    {
      key: 'track',
      header: 'Track',
      width: '2fr',
      render: (row) => (
        <p className="truncate text-sm font-medium">{row.track?.title ?? '—'}</p>
      ),
    },
    {
      key: 'requester',
      header: 'Solicitante',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm">{row.requester ? `${row.requester.name} ${row.requester.lastName}` : '—'}</p>
          <p className="truncate text-xs text-muted-foreground">{row.requester?.email}</p>
        </div>
      ),
    },
    {
      key: 'licenseType',
      header: 'Tipo de licencia',
      width: '2fr',
      render: (row) => (
        <span className="text-xs text-muted-foreground capitalize">{row.licenseType}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '120px',
      render: (row) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[row.status] ?? 'bg-muted text-muted-foreground'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      width: '100px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight">Solicitudes de Licencia</h2>
        <p className="text-sm text-muted-foreground">{data?.total ?? '—'} solicitudes en el sistema</p>
      </div>

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las solicitudes' : null}
        emptyMessage="No hay solicitudes registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />
    </div>
  )
}
