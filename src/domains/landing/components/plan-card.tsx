'use client';

import { Button } from '@/src/shared/components/UI/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { createPaymentPreference } from '../../payments/payments.actions';
import type { PlanData } from '../constants/plans';

interface PlanCardProps {
  plan: PlanData;
  convertedPrice?: string;
  showCurrencyNote?: boolean;
  isAnnual?: boolean;
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-CO')} COP`;
}

export function PlanCard({ plan, convertedPrice, showCurrencyNote, isAnnual = false }: PlanCardProps) {
  const [isPending, startTransition] = useTransition();

  const hasAnnual = !!plan.annualMonthlyPrice && !!plan.annualTotalPrice;
  const showAnnual = isAnnual && hasAnnual;

  const monthlyPrice  = plan.price;
  const annualMonthly = plan.annualMonthlyPrice!;
  const annualTotal   = plan.annualTotalPrice!;
  const annualSaving  = monthlyPrice ? (monthlyPrice * 12) - annualTotal : 0;

  function handleProCta() {
    const billingPeriod: 'monthly' | 'annual' = showAnnual ? 'annual' : 'monthly';
    startTransition(async () => {
      try {
        const { initPoint, externalReference } = await createPaymentPreference(plan.role, 'pro', billingPeriod);
        sessionStorage.setItem('mp_pending_ref', externalReference);
        sessionStorage.setItem('mp_pending_role', plan.role);
        window.open(initPoint, '_blank', 'noopener');
        window.location.href = '/register/pro/pending';
      } catch (err) {
        toast.error('No se pudo iniciar el proceso de pago', {
          description: err instanceof Error ? err.message : 'Intenta nuevamente.',
        });
      }
    });
  }

  const isPro = plan.plan === 'pro';
  const isLifetime = plan.billing.includes('único');

  return (
    <div
      className={[
        'relative flex flex-col rounded-2xl border p-6 transition-all duration-300',
        isPro && plan.highlighted
          ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]'
          : isPro
          ? 'border-border bg-card hover:border-primary/50 hover:shadow-lg'
          : 'border-border/50 bg-card/50 hover:border-border',
      ].join(' ')}
    >
      {/* Badge superior */}
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
          {plan.badge}
        </span>
      )}

      {/* Nombre y beneficio */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
        <p className="mt-1 text-sm text-primary font-medium">{plan.mainBenefit}</p>
      </div>

      {/* Precio */}
      <div className="mb-6">
        {showAnnual ? (
          <>
            {/* Precio mensual equivalente anual */}
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-foreground">
                {fmt(annualMonthly)}
              </span>
              <span className="mb-1 text-sm text-muted-foreground">/mes</span>
            </div>

            {/* Total anual y precio original tachado */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                {fmt(monthlyPrice!)}/mes
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                25% OFF
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {fmt(annualTotal)}/año · <span className="font-medium text-emerald-600 dark:text-emerald-400">Ahorras {fmt(annualSaving)} al año</span>
            </p>
          </>
        ) : (
          <>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-foreground">
                {convertedPrice ?? plan.priceLabel}
              </span>
              {plan.billing && (
                <span className="mb-1 text-sm text-muted-foreground">{plan.billing}</span>
              )}
            </div>
            {/* Hint de ahorro anual en modo mensual */}
            {hasAnnual && !isLifetime && (
              <p className="mt-1 text-xs text-muted-foreground">
                Cambia a anual y ahorra <span className="font-medium text-emerald-600 dark:text-emerald-400">{fmt(annualSaving)}/año</span>
              </p>
            )}
            {showCurrencyNote && !isLifetime && (
              <p className="mt-1 text-xs text-muted-foreground">
                Precio estimado. El cobro se realiza en COP.
              </p>
            )}
          </>
        )}
      </div>

      {/* Features */}
      <ul className="mb-6 flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {f.label}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isPro ? (
        <Button
          className="w-full"
          variant={plan.highlighted ? 'default' : 'outline'}
          onClick={handleProCta}
          disabled={isPending}
          aria-label={`${plan.cta} — ${plan.name}`}
        >
          {isPending ? 'Redirigiendo...' : plan.cta}
        </Button>
      ) : (
        <Button className="w-full" variant="ghost" asChild>
          <Link href={`/register?role=${plan.role}`} aria-label={`${plan.cta} — ${plan.name}`}>
            {plan.cta}
          </Link>
        </Button>
      )}
    </div>
  );
}
