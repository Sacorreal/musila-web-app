'use client';

import { useLegalIdentityRequired } from '@/src/shared/hooks/use-legal-identity-required';
import { LegalIdentityRequiredModal } from './LegalIdentityRequiredModal';

export function LegalIdentityRequiredWatcher() {
  const { open, close } = useLegalIdentityRequired();

  return <LegalIdentityRequiredModal open={open} onClose={close} />;
}
