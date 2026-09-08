'use client'

import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { formatCOP } from '@/src/domains/wallet/utils/format-currency'
import { useBuyerLicenses } from '../hooks/buyer-dashboard.hooks'

const approvedDateFormatter = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  APPROVED: { label: 'Aprobado', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  PENDING: { label: 'Pendiente', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  NONE: { label: 'Sin pago', className: 'bg-muted text-muted-foreground border-border' },
  FAILED: { label: 'Fallido', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
}

function formatApprovedAt(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '—'
  return approvedDateFormatter.format(date)
}

function PaymentStatusBadge({ status }: { status: string }) {
  const config = PAYMENT_STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  )
}

export function BuyerLicensedTracksTable({ organizationId }: { organizationId: string }) {
  const { data, isLoading, isError } = useBuyerLicenses(organizationId)

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-muted/40" />
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return <ErrorState message="No se pudieron cargar las canciones licenciadas de tu roster." />
  }

  const rows = data.data

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      {rows.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted-foreground">
          Aún no hay canciones licenciadas este mes.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Canción
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Autor
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Solicitado por
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Tipo de licencia
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Precio
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Estado de pago
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Fecha de aprobación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={row.requestId} className="transition-colors hover:bg-muted/30">
                  <td className="max-w-[220px] truncate px-4 py-3 font-medium">{row.trackTitle}</td>
                  <td className="max-w-[180px] truncate px-4 py-3">{row.ownerName}</td>
                  <td className="max-w-[180px] truncate px-4 py-3">{row.requesterName}</td>
                  <td className="px-4 py-3">{row.licenseType}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {row.licensePrice === null ? '—' : formatCOP(row.licensePrice)}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={row.licensePaymentStatus} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{formatApprovedAt(row.approvedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
