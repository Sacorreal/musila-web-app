'use client'

import { Users, Headphones, Music, FileText } from 'lucide-react'
import { StatCard } from './StatCard'
import type { AdminStatsDto } from '../types/admin.types'

interface Props {
  stats: AdminStatsDto
}

export function AdminStatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Usuarios" value={stats.totalUsers} icon={Users} color="blue" />
      <StatCard label="Tracks" value={stats.totalTracks} icon={Headphones} color="emerald" />
      <StatCard label="Géneros" value={stats.totalGenres} icon={Music} color="violet" />
      <StatCard label="Solicitudes" value={stats.totalRequests} icon={FileText} color="amber" />
    </div>
  )
}
