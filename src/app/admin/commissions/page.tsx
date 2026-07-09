'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Filter, X } from 'lucide-react'
import { adminCommissionsHooks } from '@/src/domains/admin/commissions/admin-commissions.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminConfirmDialog } from '@/src/domains/admin/components/AdminConfirmDialog'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import { RejectCommissionDialog } from './RejectCommissionDialog'
import {
  AffiliateCommissionStatus,
  type AdminCommissionDto,
  type AdminCommissionFilters,
} from '@/src/domains/admin/commissions/admin-commissions.types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

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

  const columns: ColumnDef<AdminCommissionDto>[] = [
    {
      key: 'affiliate',
      header: 'Afiliado',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {row.affiliate ? `${row.affiliate.name} ${row.affiliate.lastName}` : row.affiliateId}
          </p>
          {row.affiliate && <p className="truncate text-xs text-muted-foreground">{row.affiliate.email}</p>}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.commissionType === 'first_purchase' ? 'Primera compra' : 'Recurrente'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Comisión',
      width: '140px',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold">{currencyFormatter.format(row.commissionAmount)}</p>
          <p className="text-xs text-muted-foreground">de {currencyFormatter.format(row.saleAmount)}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      width: '110px',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[row.status] ?? 'bg-muted text-foreground'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      width: '110px',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '90px',
      render: (row) => {
        if (row.status !== 'pending' && row.status !== 'approved') return null
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPayTarget(row)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-600"
              aria-label="Marcar como pagada"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setRejectTargetId(row.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Rechazar comisión"
            >
              <XCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight">Comisiones</h2>
        <p className="text-sm text-muted-foreground">
          {data?.total ?? '—'} comisiones generadas por el programa de afiliados
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          Filtros
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos los estados</option>
            {Object.values(AffiliateCommissionStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {status && (
            <button
              onClick={() => setStatus('')}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>

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
