'use client';

import { PasskeyList } from '@domains/security/components/PasskeyList';
import { MfaStatus } from '@domains/security/components/MfaStatus';
import { RecoveryCodes } from '@domains/security/components/RecoveryCodes';

/**
 * Pestaña "Seguridad" de Mi Cuenta (§13): gestión de Passkeys, estado MFA /
 * TOTP y códigos de recuperación.
 */
export function SecurityTab() {
  return (
    <div className="space-y-6">
      <PasskeyList />
      <MfaStatus />
      <RecoveryCodes />
    </div>
  );
}
