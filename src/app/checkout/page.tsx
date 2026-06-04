import { MusilaLogo } from '@/src/shared/components/Icons/icons';
import { CheckoutCart } from '@/src/domains/payments/components/checkout-cart';
import { getExchangeRate } from '@/src/domains/payments/currency.actions';
import type { WompiPaymentRole } from '@/src/domains/payments/wompi.schema';
import Link from 'next/link';

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
    <div className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="mb-8 inline-flex">
          <MusilaLogo className="h-9 w-auto text-primary" />
        </Link>
        <h1 className="mb-1 text-2xl font-bold text-foreground sm:text-3xl">
          Confirma tu suscripción
        </h1>
        <p className="mb-8 text-muted-foreground">
          Revisa el detalle de tu plan y completa el pago de forma segura.
        </p>

        {role ? (
          <CheckoutCart
            role={role}
            defaultAnnual={defaultAnnual}
            currencyInfo={currencyInfo}
          />
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No se especificó un plan válido.</p>
            <Link href="/#pricing" className="mt-4 inline-block text-primary underline">
              Ver planes disponibles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
