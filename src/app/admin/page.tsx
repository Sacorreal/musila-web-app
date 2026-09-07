import { fetchAdminStats } from '@/src/domains/admin/services/admin.actions'
import { AdminStatsGrid } from '@/src/domains/admin/components/AdminStatsGrid'
import { RequestStatusBreakdown } from '@/src/domains/admin/components/RequestStatusBreakdown'
import { QuickActionsGrid } from '@/src/domains/admin/components/QuickActionsGrid'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'

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
      <PageHeader
        title="Resumen del sistema"
        titleClassName="text-2xl"
        description="Vista general de todas las entidades."
        descriptionClassName="mt-1"
      />

      {/* Stats — Client Component para evitar pasar componentes React como props */}
      <AdminStatsGrid stats={stats} />

      {/* Desglose de solicitudes */}
      <RequestStatusBreakdown stats={stats} />

      {/* Acciones rápidas */}
      <QuickActionsGrid />
    </div>
  )
}
