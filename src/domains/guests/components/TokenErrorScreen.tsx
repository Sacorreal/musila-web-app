import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Clock, XCircle } from 'lucide-react';

export type InviteTokenErrorStatus = 'used' | 'expired' | 'not_found';

const STATUS_CONFIG: Record<
  InviteTokenErrorStatus,
  { icon: typeof ShieldAlert; color: string; bg: string; title: string; desc: string }
> = {
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
};

interface TokenErrorScreenProps {
  status: InviteTokenErrorStatus;
}

export function TokenErrorScreen({ status }: TokenErrorScreenProps) {
  const config = STATUS_CONFIG[status];
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
