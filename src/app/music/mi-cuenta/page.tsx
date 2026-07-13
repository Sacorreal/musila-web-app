import { Suspense } from 'react';
import { AccountTabs } from '@/src/domains/account/components/AccountTabs';
import { AccountTabsSkeleton } from '@/src/domains/account/components/AccountTabsSkeleton';
import { PageHeader } from '@/src/shared/components/UI/PageHeader';

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export const metadata = { title: 'Mi Cuenta — Musila' };

export default async function MiCuentaPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeTab = (['perfil', 'plan', 'pagos', 'facturacion'] as const).includes(tab as any)
    ? (tab as 'perfil' | 'plan' | 'pagos' | 'facturacion')
    : 'perfil';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader title="Mi Cuenta" className="mb-6" titleClassName="text-2xl font-bold" />
      <Suspense fallback={<AccountTabsSkeleton />}>
        <AccountTabs activeTab={activeTab} />
      </Suspense>
    </div>
  );
}
