import { fetchMyStaffPermissions } from '@/src/domains/admin/staff-members/staff-members.actions'
import { AdminAccessDenied } from '@/src/domains/admin/components/AdminAccessDenied'

const REQUIRED_PERMISSIONS = ['system:staff:view', 'system:staff:manage']

export default async function AdminStaffLayout({ children }: { children: React.ReactNode }) {
  const { permissions } = await fetchMyStaffPermissions()
  const hasAccess = REQUIRED_PERMISSIONS.some((code) => permissions.includes(code))

  if (!hasAccess) {
    return <AdminAccessDenied message="Necesitas el permiso de gestión de equipo para ver esta sección." />
  }

  return <>{children}</>
}
