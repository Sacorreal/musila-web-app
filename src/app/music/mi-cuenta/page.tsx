import { Suspense } from 'react';
import { AccountTabs } from '@/src/domains/account/components/AccountTabs';
import { AccountTabsSkeleton } from '@/src/domains/account/components/AccountTabsSkeleton';

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
      <h1 className="text-2xl font-bold text-foreground mb-6">Mi Cuenta</h1>
      <Suspense fallback={<AccountTabsSkeleton />}>
        <AccountTabs activeTab={activeTab} />
      </Suspense>
    </div>
  );
}
