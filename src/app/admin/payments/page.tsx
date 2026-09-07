'use client'

import { useState } from 'react'
import { adminPaymentsHooks } from '@/src/domains/admin/readonly/payments/admin-payments.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { getPaymentColumns } from './payment-columns'

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminPaymentsHooks.useAdminPayments(page, limit)

  const columns = getPaymentColumns()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagos"
        description={`${data?.total ?? '—'} pagos registrados — solo lectura, generados vía Wompi`}
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar los pagos' : null}
        emptyMessage="No hay pagos registrados"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />
    </div>
  )
}
