import { redirect } from 'next/navigation'
import { fetchMyMemberships } from '@/src/domains/organizations/organizations.actions'
import { OrgWorkspaceShell } from './OrgWorkspaceShell'

/**
 * Área B2B del workspace. Valida server-side que el usuario tenga una
 * membership ACTIVE en la organización (solo UX; el backend re-valida cada
 * request vía AuthorizationGuard).
 */
export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = await params

  const memberships = await fetchMyMemberships().catch(() => null)
  if (!memberships) redirect('/login')

  const allMemberships = [
    ...memberships.organizationMemberships,
    ...memberships.rosterMemberships,
  ]
  const activeMembership = allMemberships.find(
    (membership) => membership.organizationId === organizationId && membership.status === 'ACTIVE',
  )

  if (!activeMembership) redirect('/music')

  const organizationOptions = allMemberships
    .filter((membership) => membership.status === 'ACTIVE')
    .map((membership) => ({
      id: membership.organizationId,
      name: membership.organization?.name ?? membership.organizationId,
    }))

  return (
    <OrgWorkspaceShell
      organizationId={organizationId}
      organizationName={activeMembership.organization?.name ?? 'Workspace'}
      organizationOptions={organizationOptions}
    >
      {children}
    </OrgWorkspaceShell>
  )
}
