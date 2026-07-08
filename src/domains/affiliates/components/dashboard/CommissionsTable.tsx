import { CommissionStatusBadge } from './CommissionStatusBadge'
import type { AffiliateCommissionSummary } from '../../types/affiliate-dashboard.types'

interface CommissionsTableProps {
  commissions: AffiliateCommissionSummary[]
}

const TYPE_LABELS: Record<AffiliateCommissionSummary['type'], string> = {
  first_purchase: 'Primera compra',
  recurring: 'Recurrente',
}

const currency = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

export function CommissionsTable({ commissions }: CommissionsTableProps) {
  if (commissions.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        Aún no tienes comisiones generadas.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="py-3 px-4 sm:px-2 font-semibold">Tipo</th>
            <th className="py-3 px-4 sm:px-2 font-semibold">Venta</th>
            <th className="py-3 px-4 sm:px-2 font-semibold">Comisión</th>
            <th className="py-3 px-4 sm:px-2 font-semibold">Fecha</th>
            <th className="py-3 px-4 sm:px-2 font-semibold text-right">Estado</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map((commission) => (
            <tr key={commission.id} className="border-b border-border/50 last:border-0">
              <td className="py-3 px-4 sm:px-2 text-muted-foreground">{TYPE_LABELS[commission.type]}</td>
              <td className="py-3 px-4 sm:px-2 text-muted-foreground">{currency.format(commission.saleAmount)}</td>
              <td className="py-3 px-4 sm:px-2 font-semibold text-foreground">{currency.format(commission.commissionAmount)}</td>
              <td className="py-3 px-4 sm:px-2 text-muted-foreground">
                {new Date(commission.createdAt).toLocaleDateString('es-CO')}
              </td>
              <td className="py-3 px-4 sm:px-2 text-right">
                <CommissionStatusBadge status={commission.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
