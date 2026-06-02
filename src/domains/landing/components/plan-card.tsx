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
}

export function PlanCard({ plan, convertedPrice, showCurrencyNote }: PlanCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleProCta() {
    startTransition(async () => {
      try {
        const { initPoint, externalReference } = await createPaymentPreference(plan.role, 'pro');
        sessionStorage.setItem('mp_pending_ref', externalReference);
        sessionStorage.setItem('mp_pending_role', plan.role);
        // Abrir MP en nueva pestaña; esta ventana va directo a la pantalla de espera
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
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
          {plan.badge}
        </span>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
        <p className="mt-1 text-sm text-primary font-medium">{plan.mainBenefit}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-foreground">
            {convertedPrice ?? plan.priceLabel}
          </span>
          {plan.billing && (
            <span className="mb-1 text-sm text-muted-foreground">{plan.billing}</span>
          )}
        </div>
        {showCurrencyNote && !plan.billing.includes('pago') && (
          <p className="mt-1 text-xs text-muted-foreground">
            Precio estimado. El cobro se realiza en COP.
          </p>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {f.label}
          </li>
        ))}
      </ul>

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
