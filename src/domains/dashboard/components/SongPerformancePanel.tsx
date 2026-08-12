'use client'

import { ListMusic, Play, Users } from 'lucide-react'
import { StatCard } from '@/src/shared/components/UI/StatCard'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { useSongDashboard } from '../hooks/dashboard.hooks'
import { DashboardCardSkeletonGrid } from './DashboardCardSkeleton'

interface Props {
  trackId: string
  /** Título opcional para mostrar mientras carga la métrica. */
  fallbackTitle?: string
}

export function SongPerformancePanel({ trackId, fallbackTitle }: Props) {
  const { data, isLoading, isError } = useSongDashboard(trackId)

  if (isLoading) return <DashboardCardSkeletonGrid count={3} />
  if (isError || !data) {
    return <ErrorState message="No se pudo cargar el rendimiento de esta canción." />
  }

  return (
    <div className="space-y-4">
      {(data.title || fallbackTitle) && (
        <h2 className="text-lg font-semibold">{data.title || fallbackTitle}</h2>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Reproducciones" value={data.plays} icon={Play} color="violet" />
        <StatCard label="Usuarios únicos" value={data.uniqueListeners} icon={Users} color="cyan" />
        <StatCard label="Playlists" value={data.playlists} icon={ListMusic} color="emerald" />
      </div>
    </div>
  )
}
