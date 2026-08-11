import { validateOrgInviteAction } from '@/src/domains/organizations/org-invite.actions'
import type { OrgInviteValidationResponse } from '@/src/domains/organizations/org-invite.types'
import { OrgAdminRegisterForm } from '@/src/domains/organizations/components/OrgAdminRegisterForm'
import { TokenErrorScreen } from '@/src/domains/guests/components/TokenErrorScreen'
import { AuthCardShell } from '@/src/domains/auth/components/AuthCardShell'
import { getInviteTokenStatus, type InviteTokenStatus } from '@/src/domains/guests/utils/invite-token-status'

interface Props {
  params: Promise<{ token: string }>
}

export default async function OrgInvitePage({ params }: Props) {
  const { token } = await params

  let status: InviteTokenStatus = 'not_found'
  let invite: OrgInviteValidationResponse | null = null

  try {
    invite = await validateOrgInviteAction(token)
    status = 'valid'
  } catch (err: unknown) {
    const httpStatus =
      typeof err === 'object' && err !== null && 'status' in err
        ? (err as { status?: number }).status
        : undefined
    status = getInviteTokenStatus(httpStatus)
  }

  return (
    <AuthCardShell
      badge="Invitación a Musila"
      title={status === 'valid' ? 'Completa tu registro' : 'Estado de la invitación'}
      description={
        status === 'valid' && invite
          ? `Has sido invitado a administrar ${invite.organizationName}. Completa el formulario para crear tu cuenta.`
          : undefined
      }
      maxWidth="lg"
      align="start"
    >
      {status === 'valid' && invite ? (
        <OrgAdminRegisterForm invite={invite} />
      ) : (
        <TokenErrorScreen status={status as Exclude<InviteTokenStatus, 'valid'>} />
      )}
    </AuthCardShell>
  )
}

export async function generateMetadata({ params }: Props) {
  await params
  return {
    title: 'Administrar tu organización | Invitación',
    description: 'Acepta tu invitación y crea tu cuenta de administrador en Músila.',
  }
}
