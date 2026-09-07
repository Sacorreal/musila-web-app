'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { adminWalletHooks } from '@/src/domains/admin/wallet/admin-wallet.hooks'
import { AdminDataTable } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { RejectWithdrawalDialog } from './RejectWithdrawalDialog'
import { getWithdrawalColumns } from './withdrawal-columns'
import { WithdrawalFiltersToolbar } from './withdrawal-filters-toolbar'
import type { AdminWalletFilters, AdminWalletWithdrawalDto } from '@/src/domains/admin/wallet/admin-wallet.types'
import { WalletWithdrawalStatus } from '@/src/domains/wallet/types/wallet.types'

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

/** Solo las solicitudes que no están en un estado final admiten pasar a "Pagado". */
const isPayable = (row: AdminWalletWithdrawalDto) =>
  row.status !== WalletWithdrawalStatus.PAID && row.status !== WalletWithdrawalStatus.REJECTED

export default function AdminWalletPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const [status, setStatus] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filters: AdminWalletFilters = { ...(status && { status: status as WalletWithdrawalStatus }) }

  useEffect(() => { setPage(1) }, [status])
  useEffect(() => { setSelectedIds(new Set()) }, [page, status])

  const { data, isLoading, error } = adminWalletHooks.useAdminWithdrawals(page, limit, filters)
  const { mutate: processWithdrawal, isPending: isProcessing } = adminWalletHooks.useProcessWithdrawal()
  const { mutate: payWithdrawal, isPending: isPaying } = adminWalletHooks.usePayWithdrawal()
  const { mutate: payWithdrawalsBatch, isPending: isPayingBatch } = adminWalletHooks.usePayWithdrawalsBatch()

  const [processTarget, setProcessTarget] = useState<AdminWalletWithdrawalDto | null>(null)
  const [payTarget, setPayTarget] = useState<AdminWalletWithdrawalDto | null>(null)
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null)
  const [confirmBatchPay, setConfirmBatchPay] = useState(false)

  const columns = getWithdrawalColumns({ onProcess: setProcessTarget, onPay: setPayTarget, onReject: setRejectTargetId })

  const rows = data?.data ?? []
  const selectedRows = rows.filter((row) => selectedIds.has(row.id))
  const selectedTotal = selectedRows.reduce((acc, row) => acc + row.amount, 0)

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = (selectableRows: AdminWalletWithdrawalDto[]) => {
    setSelectedIds((prev) => {
      const allSelected = selectableRows.length > 0 && selectableRows.every((row) => prev.has(row.id))
      return allSelected ? new Set() : new Set(selectableRows.map((row) => row.id))
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Retiros de Wallet"
        description={`${data?.total ?? '—'} solicitudes de retiro registradas`}
      />

      <WithdrawalFiltersToolbar status={status} onStatusChange={setStatus} onClearFilters={() => setStatus('')} />

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{selectedIds.size}</strong> seleccionado(s) ·{' '}
            {currencyFormatter.format(selectedTotal)}
          </p>
          <Button size="sm" className="gap-2" onClick={() => setConfirmBatchPay(true)}>
            <CheckCircle2 className="h-4 w-4" />
            Marcar seleccionados como pagados
          </Button>
        </div>
      )}

      <AdminDataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        error={error ? 'Error al cargar las solicitudes de retiro' : null}
        emptyMessage="No hay solicitudes de retiro registradas"
        keyExtractor={(row) => row.id}
        selection={{
          selectedIds,
          onToggleRow: toggleRow,
          onToggleAll: toggleAll,
          isRowSelectable: isPayable,
        }}
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

      <AdminConfirmDialog
        isOpen={confirmBatchPay}
        onClose={() => setConfirmBatchPay(false)}
        onConfirm={() => {
          payWithdrawalsBatch([...selectedIds], {
            onSuccess: () => {
              setSelectedIds(new Set())
              setConfirmBatchPay(false)
            },
          })
        }}
        isLoading={isPayingBatch}
        title={`¿Marcar ${selectedIds.size} retiro(s) como pagados?`}
        description={`Confirma que ya realizaste las transferencias de ${currencyFormatter.format(selectedTotal)} fuera de la plataforma.`}
        confirmLabel="Marcar como pagados"
      />
    </div>
  )
}
