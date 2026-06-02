'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, lazy } from 'react';
import { cn } from '@/src/shared/libs/cn';
import { AccountTabsSkeleton } from './AccountTabsSkeleton';

const ProfileTab    = lazy(() => import('./tabs/ProfileTab').then(m => ({ default: m.ProfileTab })));
const PlanTab       = lazy(() => import('./tabs/PlanTab').then(m => ({ default: m.PlanTab })));
const PaymentsTab   = lazy(() => import('./tabs/PaymentsTab').then(m => ({ default: m.PaymentsTab })));
const BillingTab    = lazy(() => import('./tabs/BillingTab').then(m => ({ default: m.BillingTab })));

type Tab = 'perfil' | 'plan' | 'pagos' | 'facturacion';

const TABS: { id: Tab; label: string }[] = [
  { id: 'perfil',      label: 'Perfil' },
  { id: 'plan',        label: 'Mi Plan' },
  { id: 'pagos',       label: 'Pagos' },
  { id: 'facturacion', label: 'Facturación' },
];

interface AccountTabsProps {
  activeTab: Tab;
}

export function AccountTabs({ activeTab }: AccountTabsProps) {
  const router = useRouter();

  function navigate(tab: Tab) {
    router.push(`/music/mi-cuenta?tab=${tab}`);
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            aria-selected={activeTab === id}
            role="tab"
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap',
              activeTab === id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <Suspense fallback={<AccountTabsSkeleton />}>
        {activeTab === 'perfil'      && <ProfileTab />}
        {activeTab === 'plan'        && <PlanTab />}
        {activeTab === 'pagos'       && <PaymentsTab />}
        {activeTab === 'facturacion' && <BillingTab />}
      </Suspense>
    </div>
  );
}
