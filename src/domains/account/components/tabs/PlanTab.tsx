'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { getPlanStatus } from '../../actions/account.actions';
import { Button } from '@/src/shared/components/UI/button';
import { AlertTriangle, Crown, Infinity } from 'lucide-react';
import { cn } from '@/src/shared/libs/cn';

const PLAN_LABELS: Record<string, string> = {
  autor_pro: 'Autor Pro',
  autor_free: 'Autor Free',
  cantautor_pro: 'Cantautor Pro',
  cantautor_free: 'Cantautor Free',
  interprete_pro: 'Intérprete Pro',
  interprete_free: 'Intérprete Free',
};

function fmt(date: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function PlanTab() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPlanStatus()
      .then(setPlan)
      .catch(() => { setError(true); toast.error('No se pudo cargar el plan'); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-40 rounded-xl bg-muted"/><div className="h-24 rounded-xl bg-muted"/></div>;

  if (error || !plan) return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <p className="text-sm text-muted-foreground mb-3">No se pudo cargar la información del plan.</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Reintentar</Button>
    </div>
  );

  const planKey = `${plan.role}_${plan.plan}`;
  const planLabel = PLAN_LABELS[planKey] ?? plan.plan;
  const isPro = plan.plan === 'pro';
  const isExpiring = plan.daysRemaining !== null && plan.daysRemaining <= 7;
  const progress = plan.isLifetime ? 0 : plan.daysRemaining !== null && plan.expiresAt && plan.startDate
    ? Math.max(0, Math.min(100, 100 - (plan.daysRemaining / ((new Date(plan.expiresAt).getTime() - new Date(plan.startDate).getTime()) / 86400000)) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Alerta vencimiento */}
      {isExpiring && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-400/40 bg-amber-50 dark:bg-amber-950/30 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300 flex-1">
            Tu plan vence en <strong>{plan.daysRemaining} {plan.daysRemaining === 1 ? 'día' : 'días'}</strong>.{' '}
            <Link href="/#pricing" className="underline font-medium">Renueva aquí</Link>
          </p>
        </div>
      )}

      {/* Card plan */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isPro && <Crown className="h-5 w-5 text-primary" />}
              <h2 className="text-lg font-bold">{planLabel}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {plan.isLifetime ? 'Acceso de por vida' : isPro ? 'Suscripción activa' : 'Plan gratuito'}
            </p>
          </div>
          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', isPro ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
            {isPro ? 'Pro' : 'Free'}
          </span>
        </div>

        {/* Fechas */}
        {isPro && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Inicio</p>
              <p className="font-medium">{fmt(plan.startDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Vencimiento</p>
              <p className="font-medium flex items-center gap-1">
                {plan.isLifetime ? <><Infinity className="h-4 w-4" /> Vitalicio</> : fmt(plan.expiresAt)}
              </p>
            </div>
          </div>
        )}

        {/* Barra de progreso */}
        {isPro && !plan.isLifetime && plan.daysRemaining !== null && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Tiempo restante</span>
              <span>{plan.daysRemaining} días</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', isExpiring ? 'bg-amber-400' : 'bg-primary')}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Features */}
        {plan.features?.length > 0 && (
          <ul className="space-y-1.5">
            {plan.features.map((f: string) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Button asChild variant="outline" className="w-full sm:w-auto">
        <Link href="/#pricing">Ver planes disponibles</Link>
      </Button>
    </div>
  );
}
