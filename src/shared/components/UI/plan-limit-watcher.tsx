'use client';

import { usePremiumUpgrade } from '@/src/shared/hooks/use-premium-upgrade';
import { PremiumUpgradeModal } from './premium-upgrade-modal';

export function PlanLimitWatcher() {
  const { open, resource, limit, close } = usePremiumUpgrade();

  return (
    <PremiumUpgradeModal
      open={open}
      onClose={close}
      resource={resource}
      limit={limit}
    />
  );
}
