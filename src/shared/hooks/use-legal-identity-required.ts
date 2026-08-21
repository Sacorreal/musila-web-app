'use client';

import { useEffect, useState } from 'react';
import { LEGAL_IDENTITY_REQUIRED_EVENT } from '@/src/shared/libs/errors/legal-identity-error';

export function useLegalIdentityRequired() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleRequired() {
      setOpen(true);
    }

    window.addEventListener(LEGAL_IDENTITY_REQUIRED_EVENT, handleRequired);
    return () => window.removeEventListener(LEGAL_IDENTITY_REQUIRED_EVENT, handleRequired);
  }, []);

  return {
    open,
    close: () => setOpen(false),
  };
}
