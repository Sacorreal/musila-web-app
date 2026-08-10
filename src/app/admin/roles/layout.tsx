import { hasAnyCapability } from '@/src/domains/admin/authorization/capability-gate'
import { AdminAccessDenied } from '@/src/domains/admin/components/AdminAccessDenied'

const REQUIRED_CAPABILITIES = ['platform.roles.view', 'platform.roles.manage']

export default async function AdminRolesLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAnyCapability(REQUIRED_CAPABILITIES))) {
    return <AdminAccessDenied message="Necesitas el permiso de gestión de roles internos para ver esta sección." />
  }

  return <>{children}</>
}
