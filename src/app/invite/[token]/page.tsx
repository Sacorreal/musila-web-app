import { validateInviteTokenAction } from '@/src/domains/guests/services/register-guest.actions';
import { GuestRegisterForm } from '@/src/domains/guests/components/GuestRegisterForm';
import { MusilaLogo } from '@/src/shared/components/Icons/icons';
import Link from 'next/link';
import { ShieldAlert, Clock, XCircle } from 'lucide-react';

// ─── Tipos de estado del token ────────────────────────────────────────────────
type TokenStatus = 'valid' | 'used' | 'expired' | 'not_found';

function getTokenStatus(statusCode?: number): TokenStatus {
  if (statusCode === 400) return 'used';
  if (statusCode === 410) return 'expired';
  if (statusCode === 404) return 'not_found';
  return 'not_found';
}

// ─── Pantalla de error según estado ──────────────────────────────────────────
function TokenErrorScreen({ status }: { status: Exclude<TokenStatus, 'valid'> }) {
  const config = {
    used: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
      title: 'Invitación ya utilizada',
      desc: 'Este enlace de invitación ya fue usado para crear una cuenta. Cada invitación es de un solo uso.',
    },
    expired: {
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      title: 'Invitación expirada',
      desc: 'Este enlace venció. Las invitaciones tienen una validez de 24 horas. Pide a quien te invitó que genere un nuevo enlace.',
    },
    not_found: {
      icon: ShieldAlert,
      color: 'text-muted-foreground',
      bg: 'bg-muted/30 border-border',
      title: 'Invitación no encontrada',
      desc: 'El enlace de invitación no es válido o no existe. Verifica que hayas copiado el enlace completo correctamente.',
    },
  }[status];

  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center text-center gap-6 py-6">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${config.bg}`}>
        <Icon className={`w-8 h-8 ${config.color}`} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-foreground">{config.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{config.desc}</p>
      </div>
      <Link
        href="/login"
        className="mt-2 text-sm font-semibold text-primary hover:underline"
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </div>
  );
}

// ─── Página principal (Server Component) ──────────────────────────────────────
interface Props {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;

  let status: TokenStatus = 'not_found';
  let invite = null;

  try {
    invite = await validateInviteTokenAction(token);
    status = 'valid';
  } catch (err: any) {
    status = getTokenStatus(err?.response?.status ?? err?.status);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/4 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="p-6 border-b border-border/50 backdrop-blur-sm">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <MusilaLogo className="h-auto w-auto text-primary" />
        </Link>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-start justify-center p-6 py-10">
        <div className="w-full max-w-lg space-y-8">

          {/* Badge */}
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-bold uppercase tracking-widest w-fit">
              Invitación a Musila
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              {status === 'valid' ? 'Completa tu registro' : 'Estado de la invitación'}
            </h1>
            {status === 'valid' && (
              <p className="text-muted-foreground text-sm">
                Has sido invitado a colaborar. Completa el formulario para crear tu cuenta.
              </p>
            )}
          </div>

          {/* Card central */}
          <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-xl shadow-black/5">
            {status === 'valid' && invite ? (
              <GuestRegisterForm invite={invite} />
            ) : (
              <TokenErrorScreen status={status as Exclude<TokenStatus, 'valid'>} />
            )}
          </div>

          {/* Footer */}
          {status === 'valid' && (
            <p className="text-xs text-muted-foreground/50 text-center leading-relaxed">
              Al registrarte aceptas los términos de uso de Músila. Tu cuenta como Invitado
              te permite colaborar en playlists y sesiones con el usuario que te invitó.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  return {
    title: 'Unirte a Musila | Invitación',
    description: 'Acepta tu invitación y crea tu cuenta en Músila para comenzar a colaborar.',
  };
}
