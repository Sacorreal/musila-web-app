import { hasAnyCapability } from '@/src/domains/admin/authorization/capability-gate'
import { AdminAccessDenied } from '@/src/domains/admin/components/AdminAccessDenied'

const REQUIRED_CAPABILITIES = ['platform.billing.view', 'platform.billing.manage']

export default async function AdminSubscriptionsLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAnyCapability(REQUIRED_CAPABILITIES))) {
    return <AdminAccessDenied message="Necesitas la capability de facturación de plataforma para ver las subscriptions." />
  }

  return <>{children}</>
}
