'use client';

import { useState } from 'react';
import { cn } from '@/src/shared/libs/cn';
import { useTranslation } from '@/src/shared/libs/i18n';
import type { CurrencyInfo } from '../../payments/currency.actions';
import { convertPrice } from '../../payments/currency.utils';
import { FREE_PLANS, PRO_PLANS } from '../constants/plans';
import { PlanCard } from './plan-card';

interface PricingCardsProps {
  currencyInfo: CurrencyInfo;
  showCurrencyNote: boolean;
}

export function PricingCards({ currencyInfo, showCurrencyNote }: PricingCardsProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-center mb-10">
        <div className="relative inline-flex items-center rounded-full bg-muted p-1 text-sm font-medium shadow-inner">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              'relative z-10 rounded-full px-5 py-2 transition-all duration-200',
              !isAnnual
                ? 'bg-background text-foreground shadow'
                : 'text-muted-foreground hover:text-foreground',
            )}
            aria-pressed={!isAnnual}
          >
            {t.pricing.monthly}
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              'relative z-10 flex items-center gap-2 rounded-full px-5 py-2 transition-all duration-200',
              isAnnual
                ? 'bg-background text-foreground shadow'
                : 'text-muted-foreground hover:text-foreground',
            )}
            aria-pressed={isAnnual}
          >
            {t.pricing.annual}
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white leading-none">
              25% OFF
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRO_PLANS.map((plan) => (
          <PlanCard
            key={`${plan.role}-${plan.plan}`}
            plan={plan}
            convertedPrice={
              plan.price !== null
                ? convertPrice(plan.price, currencyInfo)
                : undefined
            }
            showCurrencyNote={showCurrencyNote}
            isAnnual={isAnnual}
          />
        ))}
      </div>

      <details className="mt-12 group">
        <summary className="cursor-pointer list-none text-center text-sm text-muted-foreground hover:text-foreground transition-colors select-none">
          <span className="inline-flex items-center gap-1">
            {t.pricing.showFreePlans}
            <svg
              className="h-4 w-4 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </summary>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FREE_PLANS.map((plan) => (
            <PlanCard key={`${plan.role}-${plan.plan}`} plan={plan} />
          ))}
        </div>
      </details>
    </>
  );
}
