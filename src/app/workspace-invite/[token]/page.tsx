import { AuthCardShell } from '@/src/domains/auth/components/AuthCardShell'
import { TokenErrorScreen } from '@/src/domains/guests/components/TokenErrorScreen'
import type { InviteTokenErrorStatus } from '@/src/domains/guests/components/TokenErrorScreen'
import { WorkspaceGuestRegisterForm } from '@/src/domains/organizations/components/WorkspaceGuestRegisterForm'
import { validateWorkspaceInviteAction } from '@/src/domains/organizations/workspace-invite.actions'
import type { WorkspaceInviteValidation } from '@/src/domains/organizations/organizations.types'

interface Props {
  params: Promise<{ token: string }>
}

/** Mapea el error HTTP del enlace de workspace a la pantalla de estado. */
function toErrorStatus(statusCode?: number): InviteTokenErrorStatus {
  if (statusCode === 410) return 'expired'
  return 'not_found'
}

export default async function WorkspaceInvitePage({ params }: Props) {
  const { token } = await params

  let invite: WorkspaceInviteValidation | null = null
  let errorStatus: InviteTokenErrorStatus | null = null

  try {
    invite = await validateWorkspaceInviteAction(token)
  } catch (err: unknown) {
    const httpStatus =
      typeof err === 'object' && err !== null && 'status' in err
        ? (err as { status?: number }).status
        : undefined
    errorStatus = toErrorStatus(httpStatus)
  }

  return (
    <AuthCardShell
      badge="Invitación al workspace"
      title={invite ? 'Completa tu registro' : 'Estado de la invitación'}
      description={
        invite
          ? `Te invitaron a unirte a ${invite.organizationName}. Completa el formulario para crear tu cuenta y solicitar acceso.`
          : undefined
      }
      maxWidth="lg"
      align="start"
    >
      {invite ? (
        <WorkspaceGuestRegisterForm token={invite.token} organizationName={invite.organizationName} />
      ) : (
        <TokenErrorScreen status={errorStatus ?? 'not_found'} />
      )}
    </AuthCardShell>
  )
}

export async function generateMetadata({ params }: Props) {
  await params
  return {
    title: 'Unirse a un workspace | Invitación',
    description: 'Regístrate con tu enlace de invitación y solicita acceso al workspace.',
  }
}
