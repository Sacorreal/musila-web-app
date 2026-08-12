'use client'

import {
  BadgeCheck,
  CheckCircle2,
  DollarSign,
  Inbox,
  ListMusic,
  Music,
  Play,
} from 'lucide-react'
import { StatCard } from '@/src/shared/components/UI/StatCard'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { formatCOP } from '@/src/domains/wallet/utils/format-currency'
import { DashboardCardSkeletonGrid } from '@/src/domains/dashboard/components/DashboardCardSkeleton'
import { usePublisherOverview } from '../hooks/publisher-dashboard.hooks'

export function PublisherMetricsGrid({ organizationId }: { organizationId: string }) {
  const { data, isLoading, isError } = usePublisherOverview(organizationId)

  if (isLoading) return <DashboardCardSkeletonGrid count={8} />
  if (isError || !data) {
    return <ErrorState message="No se pudieron cargar las métricas del catálogo. Intenta de nuevo." />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Canciones publicadas" value={data.songsPublished} icon={Music} color="blue" />
      <StatCard label="Canciones activas" value={data.songsActive} icon={CheckCircle2} color="emerald" />
      <StatCard
        label="Ingresos generados"
        value={data.incomeGenerated}
        icon={DollarSign}
        color="amber"
        format={formatCOP}
      />
      <StatCard label="Reproducciones totales" value={data.totalPlays} icon={Play} color="violet" />
      <StatCard label="Agregadas a playlists" value={data.addedToPlaylists} icon={ListMusic} color="cyan" />
      <StatCard label="Solicitudes recibidas" value={data.licenseRequestsReceived} icon={Inbox} color="indigo" />
      <StatCard label="Licencias vendidas" value={data.licensesSold} icon={BadgeCheck} color="rose" />
    </div>
  )
}
