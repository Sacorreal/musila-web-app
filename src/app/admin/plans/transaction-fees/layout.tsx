import { hasAnyCapability } from '@/src/domains/admin/authorization/capability-gate'
import { AdminAccessDenied } from '@/src/domains/admin/components/AdminAccessDenied'

const REQUIRED_CAPABILITIES = ['platform.plans.manage']

export default async function AdminTransactionFeesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await hasAnyCapability(REQUIRED_CAPABILITIES))) {
    return (
      <AdminAccessDenied message="Necesitas la capability platform.plans.manage para administrar la comisión del marketplace." />
    )
  }

  return <>{children}</>
}
