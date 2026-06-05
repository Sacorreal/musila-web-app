'use client';

import { useState } from 'react';
import { Button } from '@/src/shared/components/UI/button';
import { useTranslation } from '@/src/shared/libs/i18n';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { t } = useTranslation();
  const tp = t.pricing;
  const [isPending, setIsPending] = useState(false);

  const hasAnnual = !!plan.annualMonthlyPrice && !!plan.annualTotalPrice;
  const showAnnual = isAnnual && hasAnnual;

  const monthlyPrice  = plan.price;
  const annualMonthly = plan.annualMonthlyPrice!;
  const annualTotal   = plan.annualTotalPrice!;
  const annualSaving  = monthlyPrice ? (monthlyPrice * 12) - annualTotal : 0;

  const isLifetime = plan.role === 'interprete' && plan.plan === 'pro';
  const billingLabel = plan.billing ? (tp.billingLabels[plan.billing] ?? plan.billing) : '';
  const priceDisplay = plan.price === null ? tp.freeLabel : (convertedPrice ?? plan.priceLabel);
  const badgeLabel = plan.badge ? (tp.planBadges[plan.badge] ?? plan.badge) : undefined;
  const ctaLabel = tp.planCtas[plan.cta] ?? plan.cta;
  const mainBenefit = tp.planMainBenefits[plan.mainBenefit] ?? plan.mainBenefit;

  const isPro = plan.plan === 'pro';

  function handleProCta() {
    const billingPeriod: 'monthly' | 'annual' = showAnnual ? 'annual' : 'monthly';
    setIsPending(true);
    router.push(`/checkout?role=${plan.role}&billing=${billingPeriod}`);
  }

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
      {badgeLabel && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
          {badgeLabel}
        </span>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
        <p className="mt-1 text-sm text-primary font-medium">{mainBenefit}</p>
      </div>

      <div className="mb-6">
        {showAnnual ? (
          <>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-foreground">{fmt(annualMonthly)}</span>
              <span className="mb-1 text-sm text-muted-foreground">{tp.perMonth}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                {fmt(monthlyPrice!)}{tp.perMonth}
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                25% OFF
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {fmt(annualTotal)}{tp.yearlyTotal}{' '}
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {fmt(annualSaving)}{tp.perYear}
              </span>
            </p>
          </>
        ) : (
          <>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-foreground">{priceDisplay}</span>
              {billingLabel && (
                <span className="mb-1 text-sm text-muted-foreground">{billingLabel}</span>
              )}
            </div>
            {hasAnnual && !isLifetime && (
              <p className="mt-1 text-xs text-muted-foreground">
                {tp.switchToAnnual}{' '}
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {fmt(annualSaving)}{tp.perYear}
                </span>
              </p>
            )}
            {showCurrencyNote && !isLifetime && (
              <p className="mt-1 text-xs text-muted-foreground">{tp.estimatedPrice}</p>
            )}
          </>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {plan.features.map((f) => {
          const featureLabel = tp.planFeatures[f.label] ?? f.label;
          return (
            <li key={f.label} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {featureLabel}
            </li>
          );
        })}
      </ul>

      {isPro ? (
        <Button
          className="w-full"
          variant={plan.highlighted ? 'default' : 'outline'}
          onClick={handleProCta}
          disabled={isPending}
          aria-label={`${ctaLabel} — ${plan.name}`}
        >
          {isPending ? tp.redirecting : ctaLabel}
        </Button>
      ) : (
        <Button className="w-full" variant="ghost" asChild>
          <Link href={`/register?role=${plan.role}&plan=free`} aria-label={`${ctaLabel} — ${plan.name}`}>
            {ctaLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
