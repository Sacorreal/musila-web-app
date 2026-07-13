import { CheckoutPageContent } from '@/src/domains/payments/components/CheckoutPageContent';
import { getExchangeRate } from '@/src/domains/payments/currency.actions';
import type { WompiPaymentRole } from '@/src/domains/payments/wompi.schema';

const VALID_ROLES: WompiPaymentRole[] = ['autor', 'cantautor', 'interprete'];

interface CheckoutPageProps {
  searchParams: Promise<{ role?: string; billing?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { role: roleParam, billing } = await searchParams;
  const currencyInfo = await getExchangeRate();

  const role = VALID_ROLES.includes(roleParam as WompiPaymentRole)
    ? (roleParam as WompiPaymentRole)
    : null;
  const defaultAnnual = billing === 'annual';

  return (
    <CheckoutPageContent role={role} defaultAnnual={defaultAnnual} currencyInfo={currencyInfo} />
  );
}
