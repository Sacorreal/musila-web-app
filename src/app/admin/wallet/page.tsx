'use client'

import { useEffect, useState } from 'react'
import { adminWalletHooks } from '@/src/domains/admin/wallet/admin-wallet.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { RejectWithdrawalDialog } from './RejectWithdrawalDialog'
import { getWithdrawalColumns } from './withdrawal-columns'
import { WithdrawalFiltersToolbar } from './withdrawal-filters-toolbar'
import type { AdminWalletFilters, AdminWalletWithdrawalDto } from '@/src/domains/admin/wallet/admin-wallet.types'
import { WalletWithdrawalStatus } from '@/src/domains/wallet/types/wallet.types'

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

export default function AdminWalletPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const [status, setStatus] = useState('')

  const filters: AdminWalletFilters = { ...(status && { status: status as WalletWithdrawalStatus }) }

  useEffect(() => { setPage(1) }, [status])

  const { data, isLoading, error } = adminWalletHooks.useAdminWithdrawals(page, limit, filters)
  const { mutate: processWithdrawal, isPending: isProcessing } = adminWalletHooks.useProcessWithdrawal()
  const { mutate: payWithdrawal, isPending: isPaying } = adminWalletHooks.usePayWithdrawal()

  const [processTarget, setProcessTarget] = useState<AdminWalletWithdrawalDto | null>(null)
  const [payTarget, setPayTarget] = useState<AdminWalletWithdrawalDto | null>(null)
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null)

  const columns = getWithdrawalColumns({ onProcess: setProcessTarget, onPay: setPayTarget, onReject: setRejectTargetId })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Retiros de Wallet"
        description={`${data?.total ?? '—'} solicitudes de retiro registradas`}
      />

      <WithdrawalFiltersToolbar status={status} onStatusChange={setStatus} onClearFilters={() => setStatus('')} />

      <AdminDataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error ? 'Error al cargar las solicitudes de retiro' : null}
        emptyMessage="No hay solicitudes de retiro registradas"
        keyExtractor={(row) => row.id}
      />

      <AdminPagination total={data?.total ?? 0} page={page} limit={limit} onPageChange={setPage} />

      <AdminConfirmDialog
        isOpen={!!processTarget}
        onClose={() => setProcessTarget(null)}
        onConfirm={() => {
          if (processTarget) processWithdrawal(processTarget.id, { onSuccess: () => setProcessTarget(null) })
        }}
        isLoading={isProcessing}
        title="¿Marcar como en proceso?"
        description={`La solicitud de ${processTarget ? currencyFormatter.format(processTarget.amount) : ''} quedará en proceso mientras se realiza la transferencia.`}
        confirmLabel="Marcar en proceso"
      />

      <AdminConfirmDialog
        isOpen={!!payTarget}
        onClose={() => setPayTarget(null)}
        onConfirm={() => {
          if (payTarget) payWithdrawal(payTarget.id, { onSuccess: () => setPayTarget(null) })
        }}
        isLoading={isPaying}
        title="¿Marcar retiro como pagado?"
        description={`Confirma que ya realizaste la transferencia de ${payTarget ? currencyFormatter.format(payTarget.amount) : ''} fuera de la plataforma.`}
        confirmLabel="Marcar como pagado"
      />

      <RejectWithdrawalDialog withdrawalId={rejectTargetId} onClose={() => setRejectTargetId(null)} />
    </div>
  )
}
