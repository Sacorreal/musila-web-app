import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrganizationSecuritySettings } from './OrganizationSecuritySettings';
import type { OrganizationSecurityPolicy } from '../types/security.types';

let policy: OrganizationSecurityPolicy | undefined;
const updateMock = jest.fn();

jest.mock('../hooks/security.hooks', () => ({
  useOrganizationPolicy: () => ({ data: policy, isLoading: false }),
  useUpdateOrganizationPolicy: () => ({ mutateAsync: updateMock, isPending: false }),
}));

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

// El paso de step-up se aísla: el modal real dispara la ceremonia WebAuthn/TOTP,
// aquí solo se prueba que persistPolicy se invoca cuando el step-up se resuelve.
jest.mock('./StepUpAuthModal', () => ({
  StepUpAuthModal: ({ open, onVerified }: { open: boolean; onVerified: () => void }) =>
    open ? <button onClick={onVerified}>Verificar (mock)</button> : null,
}));

describe('OrganizationSecuritySettings', () => {
  beforeEach(() => {
    updateMock.mockReset();
    policy = {
      organizationId: 'org-1',
      mfaRequired: false,
      passkeyRequired: false,
      totpAllowed: true,
      recoveryCodesRequired: false,
    };
  });

  it('activar "Passkey obligatoria" fuerza "MFA obligatoria" (coherencia)', () => {
    render(<OrganizationSecuritySettings organizationId="org-1" />);

    fireEvent.click(screen.getByLabelText(/passkey obligatoria/i));

    expect(screen.getByLabelText(/mfa obligatoria/i)).toBeChecked();
  });

  it('guardar exige step-up antes de persistir la política', async () => {
    updateMock.mockResolvedValue(policy);
    render(<OrganizationSecuritySettings organizationId="org-1" />);

    fireEvent.click(screen.getByLabelText(/passkey obligatoria/i));
    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    expect(updateMock).not.toHaveBeenCalled();

    fireEvent.click(await screen.findByRole('button', { name: /verificar \(mock\)/i }));

    await waitFor(() =>
      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({ passkeyRequired: true, mfaRequired: true }),
      ),
    );
  });
});
