import { hasAnyCapability } from '@/src/domains/admin/authorization/capability-gate'
import { AdminAccessDenied } from '@/src/domains/admin/components/AdminAccessDenied'

const REQUIRED_CAPABILITIES = ['platform.organizations.view', 'platform.organizations.manage']

export default async function AdminOrganizationsLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAnyCapability(REQUIRED_CAPABILITIES))) {
    return <AdminAccessDenied message="Necesitas la capability de organizaciones para ver esta sección." />
  }

  return <>{children}</>
}
