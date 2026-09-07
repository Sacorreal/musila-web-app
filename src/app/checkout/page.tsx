import { CheckoutPageContent } from '@/src/domains/payments/components/CheckoutPageContent';
import { getExchangeRate } from '@/src/domains/payments/currency.actions';
import type { WompiPlanType } from '@/src/domains/payments/wompi.schema';

const VALID_PLAN_TYPES: WompiPlanType[] = ['plan_autor', 'plan_360', 'plan_descubridor'];

/** Compatibilidad con enlaces de marketing antiguos que usan `?role=` con los nombres previos. */
const LEGACY_ROLE_TO_PLAN_TYPE: Record<string, WompiPlanType> = {
  autor: 'plan_autor',
  cantautor: 'plan_360',
  interprete: 'plan_descubridor',
};

interface CheckoutPageProps {
  searchParams: Promise<{ planType?: string; role?: string; billing?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { planType: planTypeParam, role: legacyRole, billing } = await searchParams;
  const currencyInfo = await getExchangeRate();

  const resolvedParam = planTypeParam ?? (legacyRole ? LEGACY_ROLE_TO_PLAN_TYPE[legacyRole] : undefined);
  const planType = VALID_PLAN_TYPES.includes(resolvedParam as WompiPlanType)
    ? (resolvedParam as WompiPlanType)
    : null;
  const defaultAnnual = billing === 'annual';

  return (
    <CheckoutPageContent planType={planType} defaultAnnual={defaultAnnual} currencyInfo={currencyInfo} />
  );
}
