'use client'

import { useEffect, useState } from 'react'
import { adminCommissionsHooks } from '@/src/domains/admin/commissions/admin-commissions.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { RejectCommissionDialog } from './RejectCommissionDialog'
import { getCommissionColumns } from './commission-columns'
import { CommissionFiltersToolbar } from './commission-filters-toolbar'
import {
  AffiliateCommissionStatus,
  type AdminCommissionDto,
  type AdminCommissionFilters,
} from '@/src/domains/admin/commissions/admin-commissions.types'

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

export default function AdminCommissionsPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const [status, setStatus] = useState('')

  const filters: AdminCommissionFilters = { ...(status && { status: status as AffiliateCommissionStatus }) }

  useEffect(() => { setPage(1) }, [status])

  const { data, isLoading, error } = adminCommissionsHooks.useAdminCommissions(page, limit, filters)
  const { mutate: payCommission, isPending: isPaying } = adminCommissionsHooks.usePayCommission()

  const [payTarget, setPayTarget] = useState<AdminCommissionDto | null>(null)
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null)

  const columns = getCommissionColumns({ onPay: setPayTarget, onReject: setRejectTargetId })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comisiones"
        description={`${data?.total ?? '—'} comisiones generadas por el programa de afiliados`}
      />

      <CommissionFiltersToolbar status={status} onStatusChange={setStatus} onClearFilters={() => setStatus('')} />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las comisiones' : null}
        emptyMessage="No hay comisiones registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!payTarget}
        onClose={() => setPayTarget(null)}
        onConfirm={() => {
          if (payTarget) payCommission(payTarget.id, { onSuccess: () => setPayTarget(null) })
        }}
        isLoading={isPaying}
        title="¿Marcar comisión como pagada?"
        description={`Se registrará el pago de ${payTarget ? currencyFormatter.format(payTarget.commissionAmount) : ''} al afiliado.`}
        confirmLabel="Marcar como pagada"
      />

      <RejectCommissionDialog commissionId={rejectTargetId} onClose={() => setRejectTargetId(null)} />
    </div>
  )
}
