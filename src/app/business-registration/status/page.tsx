import { CheckCircle2 } from 'lucide-react';
import { CenteredAuthShell } from '@/src/domains/auth/components/CenteredAuthShell';

export const metadata = {
  title: 'Musila Business — Solicitud enviada',
};

export default function BusinessRegistrationStatusPage() {
  return (
    <CenteredAuthShell maxWidth="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter italic">Solicitud enviada</h1>
        <p className="text-sm text-muted-foreground">
          Musila revisará tu registro. Te notificaremos por email y aquí mismo en la plataforma cuando
          tu solicitud sea aprobada y sepamos cuál es el siguiente paso.
        </p>
      </div>
    </CenteredAuthShell>
  );
}
