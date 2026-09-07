'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { getPlanStatus } from '../../actions/account.actions';
import { Button } from '@/src/shared/components/UI/button';
import { AlertTriangle, CalendarCheck, CalendarX, Crown, Infinity, RefreshCw } from 'lucide-react';
import { cn } from '@/src/shared/libs/cn';

const PLAN_LABELS: Record<string, string> = {
  plan_autor_pro: 'Plan Autor Pro',
  plan_autor_free: 'Plan Autor Free',
  plan_360_pro: 'Plan 360 Pro',
  plan_360_free: 'Plan 360 Free',
  plan_descubridor_pro: 'Plan Descubridor Pro',
  plan_descubridor_free: 'Plan Descubridor Free',
};

const BILLING_LABELS: Record<string, string> = {
  monthly: 'Mensual',
  annual: 'Anual',
};

function fmt(date: string | Date | null | undefined) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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

  if (loading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 rounded-xl bg-muted" />
      <div className="h-24 rounded-xl bg-muted" />
    </div>
  );

  if (error || !plan) return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <p className="text-sm text-muted-foreground mb-3">No se pudo cargar la información del plan.</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Reintentar</Button>
    </div>
  );

  const planKey = `${plan.planType}_${plan.plan}`;
  const planLabel = PLAN_LABELS[planKey] ?? plan.plan;
  const isPro = plan.plan === 'pro';
  const isExpiring = plan.daysRemaining !== null && plan.daysRemaining <= 7;

  const startDateStr = fmt(plan.startDate);
  const expiresAtStr = fmt(plan.expiresAt);
  const billingLabel = plan.billingPeriod ? BILLING_LABELS[plan.billingPeriod] : null;

  const progress =
    plan.isLifetime || !plan.daysRemaining || !plan.expiresAt || !plan.startDate
      ? null
      : Math.max(
          0,
          Math.min(
            100,
            100 -
              (plan.daysRemaining /
                ((new Date(plan.expiresAt).getTime() - new Date(plan.startDate).getTime()) /
                  86400000)) *
                100,
          ),
        );

  return (
    <div className="space-y-6">
      {/* Alerta vencimiento */}
      {isExpiring && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-400/40 bg-amber-50 dark:bg-amber-950/30 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300 flex-1">
            Tu plan vence en{' '}
            <strong>{plan.daysRemaining} {plan.daysRemaining === 1 ? 'día' : 'días'}</strong>.{' '}
            <Link href="/#pricing" className="underline font-medium">Renueva aquí</Link>
          </p>
        </div>
      )}

      {/* Card plan */}
      <section className="rounded-xl border bg-card p-6 space-y-6">

        {/* Nombre y badge */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isPro && <Crown className="h-5 w-5 text-primary" />}
              <h2 className="text-lg font-bold">{planLabel}</h2>
              {billingLabel && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {billingLabel}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {plan.isLifetime ? 'Acceso de por vida' : isPro ? 'Suscripción activa' : 'Plan gratuito'}
            </p>
          </div>
          <span className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold',
            isPro ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
          )}>
            {isPro ? 'Pro' : 'Free'}
          </span>
        </div>

        {/* Fechas — siempre visibles para Pro */}
        {isPro && (
          <div className="grid grid-cols-2 gap-3">
            {/* Fecha de inicio */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                <CalendarCheck className="h-3.5 w-3.5" />
                Inicio del plan
              </div>
              <p className="text-sm font-semibold text-foreground">
                {startDateStr ?? <span className="text-muted-foreground font-normal">No disponible</span>}
              </p>
            </div>

            {/* Fecha de vencimiento */}
            <div className={cn(
              'rounded-lg p-4 space-y-1.5',
              plan.isLifetime
                ? 'bg-primary/5'
                : isExpiring
                  ? 'bg-amber-50 dark:bg-amber-950/20'
                  : 'bg-muted/50',
            )}>
              <div className={cn(
                'flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide',
                plan.isLifetime ? 'text-primary' : isExpiring ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground',
              )}>
                {plan.isLifetime
                  ? <Infinity className="h-3.5 w-3.5" />
                  : <CalendarX className="h-3.5 w-3.5" />}
                Vencimiento
              </div>
              <p className={cn(
                'text-sm font-semibold',
                plan.isLifetime ? 'text-primary' : isExpiring ? 'text-amber-700 dark:text-amber-300' : 'text-foreground',
              )}>
                {plan.isLifetime
                  ? 'Vitalicio'
                  : expiresAtStr ?? <span className="text-muted-foreground font-normal">No disponible</span>}
              </p>
            </div>
          </div>
        )}

        {/* Barra de progreso */}
        {isPro && !plan.isLifetime && plan.daysRemaining !== null && progress !== null && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <div className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Tiempo restante
              </div>
              <span className={cn('font-medium', isExpiring ? 'text-amber-500' : '')}>
                {plan.daysRemaining} {plan.daysRemaining === 1 ? 'día' : 'días'}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isExpiring ? 'bg-amber-400' : 'bg-primary',
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Features */}
        {plan.features?.length > 0 && (
          <ul className="space-y-1.5 pt-1 border-t">
            {plan.features.map((f: string) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground pt-1.5 first:pt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Button asChild variant="outline" className="w-full sm:w-auto">
        <Link href="/#pricing" target="_blank" rel="noopener noreferrer">Ver planes disponibles</Link>
      </Button>
    </div>
  );
}
