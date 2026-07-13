'use client'

import { useState } from 'react'
import { adminPaymentSourcesHooks } from '@/src/domains/admin/readonly/payment-sources/admin-payment-sources.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { getPaymentSourceColumns } from './payment-source-columns'

export default function AdminPaymentSourcesPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminPaymentSourcesHooks.useAdminPaymentSources(page, limit)

  const columns = getPaymentSourceColumns()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuentes de Pago"
        description={`${data?.total ?? '—'} fuentes de pago registradas — solo lectura (PCI-DSS: nunca se muestra el número completo)`}
      />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las fuentes de pago' : null}
        emptyMessage="No hay fuentes de pago registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />
    </div>
  )
}
