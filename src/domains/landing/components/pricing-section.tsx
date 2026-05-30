import type { CurrencyInfo } from '../../payments/currency.actions';
import { convertPrice } from '../../payments/currency.utils';
import { FREE_PLANS, PRO_PLANS } from '../constants/plans';
import { PlanCard } from './plan-card';
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

        {/* Tarjetas Pro */}
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
            />
          ))}
        </div>

        <TrustBadges isMonthly />

        {/* Planes Free colapsados */}
        <details className="mt-12 group">
          <summary className="cursor-pointer list-none text-center text-sm text-muted-foreground hover:text-foreground transition-colors select-none">
            <span className="inline-flex items-center gap-1">
              Ver planes gratuitos
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

        {/* Comparador */}
        <PlanComparator />
      </div>
    </section>
  );
}
