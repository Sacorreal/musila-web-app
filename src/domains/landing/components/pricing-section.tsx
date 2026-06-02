'use client';

import type { CurrencyInfo } from '../../payments/currency.actions';
import { useTranslation } from '@/src/shared/libs/i18n';
import { PricingCards } from './pricing-cards';
import { PlanComparator } from './plan-comparator';

function TrustBadges({ isMonthly }: { isMonthly?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">{t.pricing.securePay}</span>
      <span className="flex items-center gap-1">{t.pricing.processedBy}</span>
      <span className="flex items-center gap-1">{t.pricing.noHiddenFees}</span>
      {isMonthly && (
        <span className="flex items-center gap-1">{t.pricing.cancelAnytime}</span>
      )}
    </div>
  );
}

interface PricingSectionProps {
  currencyInfo: CurrencyInfo;
}

export function PricingSection({ currencyInfo }: PricingSectionProps) {
  const showCurrencyNote = !currencyInfo.isCOP;
  const { t } = useTranslation();

  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            {t.pricing.title}
          </h2>
          <p className="text-lg text-muted-foreground">{t.pricing.subtitle}</p>
        </div>

        <PricingCards currencyInfo={currencyInfo} showCurrencyNote={showCurrencyNote} />

        <TrustBadges isMonthly />

        <PlanComparator />
      </div>
    </section>
  );
}
