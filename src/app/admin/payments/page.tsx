'use client'

import { useState } from 'react'
import { adminPaymentsHooks } from '@/src/domains/admin/readonly/payments/admin-payments.hooks'
import { AdminDataTable, type ColumnDef } from '@/src/domains/admin/components/AdminDataTable'
import { AdminPagination } from '@/src/domains/admin/components/AdminPagination'
import type { AdminPaymentDto } from '@/src/domains/admin/readonly/payments/admin-payments.types'

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-muted text-muted-foreground',
}

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = adminPaymentsHooks.useAdminPayments(page, limit)

  const columns: ColumnDef<AdminPaymentDto>[] = [
    {
      key: 'user',
      header: 'Usuario',
      width: '2fr',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.user ? `${row.user.name} ${row.user.lastName}` : '—'}</p>
          <p className="truncate text-xs text-muted-foreground">{row.user?.email}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Monto',
      width: '120px',
      render: (row) => (
        <span className="text-sm font-semibold">{row.amount != null ? currencyFormatter.format(row.amount) : '—'}</span>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      width: '110px',
      render: (row) => <span className="text-xs text-muted-foreground">{row.paymentType}</span>,
    },
    {
      key: 'plan',
      header: 'Plan',
      width: '90px',
      render: (row) => <span className="text-xs text-muted-foreground uppercase">{row.planType}</span>,
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
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight">Pagos</h2>
        <p className="text-sm text-muted-foreground">
          {data?.total ?? '—'} pagos registrados — solo lectura, generados vía Wompi
        </p>
      </div>

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
