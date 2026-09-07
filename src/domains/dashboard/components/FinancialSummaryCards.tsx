'use client'

import { Banknote, CalendarClock, Hourglass, TrendingUp, Wallet } from 'lucide-react'
import { StatCard } from '@/src/shared/components/UI/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { formatCOP } from '@/src/domains/wallet/utils/format-currency'
import { useAuthorFinancial } from '../hooks/dashboard.hooks'
import { DashboardCardSkeletonGrid, DashboardCardSkeleton } from './DashboardCardSkeleton'

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function FinancialSummaryCards() {
  const { data, isLoading, isError } = useAuthorFinancial()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <DashboardCardSkeletonGrid count={4} />
        <DashboardCardSkeleton className="h-28" />
      </div>
    )
  }
  if (isError || !data) {
    return <ErrorState message="No se pudo cargar tu resumen financiero." />
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saldo disponible" value={data.availableBalance} icon={Wallet} color="emerald" format={formatCOP} />
        <StatCard label="Saldo pendiente" value={data.pendingBalance} icon={Hourglass} color="amber" format={formatCOP} />
        <StatCard label="Ganancias totales" value={data.totalEarned} icon={TrendingUp} color="blue" format={formatCOP} />
        <StatCard label="Total retirado" value={data.totalWithdrawn} icon={Banknote} color="violet" format={formatCOP} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <CalendarClock className="h-4 w-4 text-indigo-500" />
            Próximo pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.nextPayment ? (
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-2xl font-black tabular-nums text-indigo-600 dark:text-indigo-400">
                  {formatCOP(data.nextPayment.amount)}
                </p>
                {data.nextPayment.trackTitle && (
                  <p className="text-sm text-muted-foreground">{data.nextPayment.trackTitle}</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Vence el{' '}
                <span className="font-semibold text-foreground">
                  {dateFormatter.format(new Date(data.nextPayment.dueDate))}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No tienes cuotas de licencia pendientes por cobrar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
