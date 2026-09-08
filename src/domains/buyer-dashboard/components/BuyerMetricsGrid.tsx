'use client'

import { motion } from 'framer-motion'
import { BadgeCheck, DollarSign, Play, Users } from 'lucide-react'
import { StatCard } from '@/src/shared/components/UI/StatCard'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { formatCOP } from '@/src/domains/wallet/utils/format-currency'
import { DashboardCardSkeletonGrid } from '@/src/domains/dashboard/components/DashboardCardSkeleton'
import { useBuyerOverview } from '../hooks/buyer-dashboard.hooks'

function formatDeltaPct(pct: number): string {
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct}% vs mes anterior`
}

export function BuyerMetricsGrid({ organizationId }: { organizationId: string }) {
  const { data, isLoading, isError } = useBuyerOverview(organizationId)

  if (isLoading) return <DashboardCardSkeletonGrid count={4} />
  if (isError || !data) {
    return <ErrorState message="No se pudieron cargar las métricas de tu organización. Intenta de nuevo." />
  }

  if (data.activeRosterMembers === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        role="status"
        className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 px-6 py-14 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
          <Users className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Tu organización aún no tiene artistas activos en su roster
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Invita artistas a tu roster para empezar a ver cuánto escuchan y licencian tus canciones cada mes.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Reproducciones del mes"
        value={data.playsThisMonth}
        icon={Play}
        color="violet"
        description={formatDeltaPct(data.playsChangePct)}
      />
      <StatCard
        label="Licenciadas este mes"
        value={data.licensesThisMonth}
        icon={BadgeCheck}
        color="emerald"
        description={formatDeltaPct(data.licensesChangePct)}
      />
      <StatCard label="Miembros activos del roster" value={data.activeRosterMembers} icon={Users} color="cyan" />
      <StatCard
        label="Valor licenciado del mes"
        value={data.licensedValueThisMonth}
        icon={DollarSign}
        color="amber"
        format={formatCOP}
      />
    </div>
  )
}
