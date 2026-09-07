import { Clock, CheckCircle, XCircle } from 'lucide-react'
import type { AdminStatsDto } from '../types/admin.types'

interface Props {
  stats: AdminStatsDto
}

export function RequestStatusBreakdown({ stats }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-sm font-semibold mb-4">Estado de Solicitudes</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <Clock className="h-5 w-5 text-amber-500 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.pendingRequests}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Aprobadas</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.approvedRequests}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Rechazadas</p>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats.rejectedRequests}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
