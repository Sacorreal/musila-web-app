import type { CurrencyInfo } from '../../payments/currency.actions';
import { PricingCards } from './pricing-cards';
import { PlanComparator } from './plan-comparator';

function TrustBadges({ isMonthly }: { isMonthly?: boolean }) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">🔒 Pagos seguros</span>
      <span className="flex items-center gap-1">💳 Procesado por Mercado Pago</span>
      <span className="flex items-center gap-1">✅ Sin cargos ocultos</span>
      {isMonthly && (
        <span className="flex items-center gap-1">🔄 Cancelación en cualquier momento</span>
      )}
    </div>
  );
}

interface PricingSectionProps {
  currencyInfo: CurrencyInfo;
}

export function PricingSection({ currencyInfo }: PricingSectionProps) {
  const showCurrencyNote = !currencyInfo.isCOP;

  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Planes para cada artista
          </h2>
          <p className="text-lg text-muted-foreground">
            Empieza gratis y crece con tu música. Sin límites cuando estés listo.
          </p>
        </div>

        <PricingCards currencyInfo={currencyInfo} showCurrencyNote={showCurrencyNote} />

        <TrustBadges isMonthly />

        {/* Comparador */}
        <PlanComparator />
      </div>
    </section>
  );
}
