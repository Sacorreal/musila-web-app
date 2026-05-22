import { fetchAdminStats } from '@/src/domains/admin/services/admin.actions'
import { AdminStatsGrid } from '@/src/domains/admin/components/AdminStatsGrid'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

const quickActions = [
  { href: '/admin/users', label: 'Gestionar Usuarios', colorClass: 'text-blue-500 bg-blue-500/10' },
  { href: '/admin/genres', label: 'Gestionar Géneros', colorClass: 'text-violet-500 bg-violet-500/10' },
  { href: '/admin/tracks', label: 'Ver Tracks', colorClass: 'text-emerald-500 bg-emerald-500/10' },
  { href: '/admin/requests', label: 'Ver Solicitudes', colorClass: 'text-amber-500 bg-amber-500/10' },
]

export default async function AdminDashboardPage() {
  let stats = {
    totalUsers: 0,
    totalTracks: 0,
    totalGenres: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  }

  try {
    stats = await fetchAdminStats()
  } catch {
    // stats permanecen en 0 si falla la petición
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Resumen del sistema</h2>
        <p className="text-sm text-muted-foreground mt-1">Vista general de todas las entidades.</p>
      </div>

      {/* Stats — Client Component para evitar pasar componentes React como props */}
      <AdminStatsGrid stats={stats} />

      {/* Desglose de solicitudes */}
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

      {/* Acciones rápidas — solo strings y hrefs, sin componentes React */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ href, label, colorClass }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
                <span className="text-lg font-black">→</span>
              </div>
              <span className="text-sm font-semibold group-hover:text-primary transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
