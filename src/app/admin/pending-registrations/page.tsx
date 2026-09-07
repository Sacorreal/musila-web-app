'use client'

import { useState } from 'react'
import { adminPendingRegistrationsHooks } from '@/src/domains/admin/readonly/pending-registrations/admin-pending-registrations.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { getPendingRegistrationColumns } from './pending-registration-columns'

export default function AdminPendingRegistrationsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminPendingRegistrationsHooks.useAdminPendingRegistrations(page, limit)

  const columns = getPendingRegistrationColumns()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registros Pendientes"
        description={`${data?.total ?? '—'} registros — solo lectura, estado interno del flujo de pago`}
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los registros' : null}
        emptyMessage="No hay registros pendientes"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />
    </div>
  )
}
