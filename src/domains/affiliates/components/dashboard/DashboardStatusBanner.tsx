import React from 'react';
import type { AffiliateStatus } from '@/src/domains/affiliates/types/affiliate.types';

interface DashboardStatusBannerProps {
  status: AffiliateStatus;
}

export function DashboardStatusBanner({ status }: DashboardStatusBannerProps) {
  if (status === 'approved') return null;

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
      Tu cuenta está en estado <strong>{status}</strong>. Contacta al equipo de
      Musila para más información.
    </div>
  );
}
