'use client';

import { useEffect, useState } from 'react';

interface PlanLimitDetail {
  resource?: string;
  limit?: number;
}

export function usePremiumUpgrade() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<PlanLimitDetail>({});

  useEffect(() => {
    function handleLimitReached(e: Event) {
      const detail = (e as CustomEvent<PlanLimitDetail>).detail ?? {};
      setDetail(detail);
      setOpen(true);
    }

    window.addEventListener('plan:limit-reached', handleLimitReached);
    return () => window.removeEventListener('plan:limit-reached', handleLimitReached);
  }, []);

  return {
    open,
    resource: detail.resource,
    limit: detail.limit,
    close: () => setOpen(false),
  };
}
