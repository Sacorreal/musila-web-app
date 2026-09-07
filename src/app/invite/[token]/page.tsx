import { validateInviteTokenAction } from '@/src/domains/guests/services/register-guest.actions';
import { GuestRegisterForm } from '@/src/domains/guests/components/GuestRegisterForm';
import { TokenErrorScreen } from '@/src/domains/guests/components/TokenErrorScreen';
import { InviteAcceptanceNote } from '@/src/domains/guests/components/InviteAcceptanceNote';
import { AuthCardShell } from '@/src/domains/auth/components/AuthCardShell';
import { getInviteTokenStatus, type InviteTokenStatus } from '@/src/domains/guests/utils/invite-token-status';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;

  let status: InviteTokenStatus = 'not_found';
  let invite = null;

  try {
    invite = await validateInviteTokenAction(token);
    status = 'valid';
  } catch (err: any) {
    status = getInviteTokenStatus(err?.response?.status ?? err?.status);
  }

  return (
    <AuthCardShell
      badge="Invitación a Musila"
      title={status === 'valid' ? 'Completa tu registro' : 'Estado de la invitación'}
      description={
        status === 'valid'
          ? 'Has sido invitado a colaborar. Completa el formulario para crear tu cuenta.'
          : undefined
      }
      maxWidth="lg"
      align="start"
      footer={status === 'valid' ? <InviteAcceptanceNote /> : undefined}
    >
      {status === 'valid' && invite ? (
        <GuestRegisterForm invite={invite} />
      ) : (
        <TokenErrorScreen status={status as Exclude<InviteTokenStatus, 'valid'>} />
      )}
    </AuthCardShell>
  );
}

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  return {
    title: 'Unirte a Musila | Invitación',
    description: 'Acepta tu invitación y crea tu cuenta en Músila para comenzar a colaborar.',
  };
}
