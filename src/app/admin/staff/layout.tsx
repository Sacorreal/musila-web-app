import { hasAnyCapability } from '@/src/domains/admin/authorization/capability-gate'
import { AdminAccessDenied } from '@/src/domains/admin/components/AdminAccessDenied'

const REQUIRED_CAPABILITIES = ['platform.staff.view', 'platform.staff.manage']

export default async function AdminStaffLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAnyCapability(REQUIRED_CAPABILITIES))) {
    return <AdminAccessDenied message="Necesitas el permiso de gestión de equipo para ver esta sección." />
  }

  return <>{children}</>
}
