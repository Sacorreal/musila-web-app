import { render, screen } from '@testing-library/react';
import { MfaStatus } from './MfaStatus';
import type { MfaStatus as MfaStatusType } from '../types/security.types';

let mfaStatus: MfaStatusType | undefined;
let isLoading = false;

jest.mock('../hooks/security.hooks', () => ({
  useMfaStatus: () => ({ data: mfaStatus, isLoading }),
  useSetupTotp: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useConfirmTotp: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useDisableTotp: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('MfaStatus', () => {
  beforeEach(() => {
    isLoading = false;
    mfaStatus = {
      mfaEnabled: false,
      passkeysCount: 0,
      totpEnabled: false,
      recoveryCodesRemaining: 0,
      availableMethods: [],
    };
  });

  it('muestra el estado de carga', () => {
    isLoading = true;
    render(<MfaStatus />);
    expect(screen.getByText(/cargando estado/i)).toBeInTheDocument();
  });

  it('muestra "MFA inactiva" cuando no hay ningún factor', () => {
    render(<MfaStatus />);
    expect(screen.getByText(/mfa inactiva/i)).toBeInTheDocument();
  });

  it('muestra "MFA activa" cuando hay al menos una passkey', () => {
    mfaStatus!.mfaEnabled = true;
    mfaStatus!.passkeysCount = 1;
    render(<MfaStatus />);
    expect(screen.getByText(/mfa activa/i)).toBeInTheDocument();
  });

  it('muestra el badge de cumplimiento de política de organización cuando aplica', () => {
    mfaStatus!.organizationPolicy = {
      organizationId: 'org-1',
      mfaRequired: true,
      passkeyRequired: false,
      totpAllowed: true,
      satisfied: false,
      missing: ['MFA'],
    };
    render(<MfaStatus organizationId="org-1" />);
    expect(screen.getByText(/requerida por la organización/i)).toBeInTheDocument();
  });
});
