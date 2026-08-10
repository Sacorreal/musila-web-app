import { hasAnyCapability } from '@/src/domains/admin/authorization/capability-gate'
import { AdminAccessDenied } from '@/src/domains/admin/components/AdminAccessDenied'

const REQUIRED_CAPABILITIES = ['platform.settings.manage']

export default async function AdminCapabilitiesLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAnyCapability(REQUIRED_CAPABILITIES))) {
    return <AdminAccessDenied message="Necesitas la capability de configuración de plataforma para administrar la matriz de capacidades." />
  }

  return <>{children}</>
}
