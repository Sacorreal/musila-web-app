import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StepUpAuthModal } from './StepUpAuthModal';

const stepUpMock = jest.fn();
let mfaStatus: { passkeysCount: number; totpEnabled: boolean };

jest.mock('./../hooks/security.hooks', () => ({
  useMfaStatus: () => ({ data: mfaStatus }),
  useStepUp: () => ({ mutateAsync: stepUpMock, isPending: false }),
}));

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('StepUpAuthModal', () => {
  beforeEach(() => {
    stepUpMock.mockReset();
    mfaStatus = { passkeysCount: 1, totpEnabled: false };
  });

  it('ofrece verificar con Passkey y llama a onVerified al completarse', async () => {
    stepUpMock.mockResolvedValue({ grantedUntil: new Date().toISOString() });
    const onVerified = jest.fn();

    render(
      <StepUpAuthModal
        open
        onOpenChange={() => {}}
        scope="account.change_password"
        onVerified={onVerified}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /verificar con passkey/i }));

    await waitFor(() => expect(onVerified).toHaveBeenCalled());
    expect(stepUpMock).toHaveBeenCalledWith({
      scope: 'account.change_password',
      method: 'PASSKEY',
    });
  });

  it('muestra aviso cuando no hay métodos configurados', () => {
    mfaStatus = { passkeysCount: 0, totpEnabled: false };
    render(
      <StepUpAuthModal open onOpenChange={() => {}} scope="x" onVerified={jest.fn()} />,
    );
    expect(screen.getByText(/no tienes métodos de verificación/i)).toBeInTheDocument();
  });

  it('oculta el bloque TOTP cuando allowedMethods solo permite Passkey', () => {
    mfaStatus = { passkeysCount: 1, totpEnabled: true };
    render(
      <StepUpAuthModal
        open
        onOpenChange={() => {}}
        scope="platform.admin.create"
        onVerified={jest.fn()}
        allowedMethods={['PASSKEY']}
      />,
    );
    expect(screen.getByRole('button', { name: /verificar con passkey/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/código de tu app de autenticación/i)).not.toBeInTheDocument();
  });

  it('muestra el aviso de Passkey obligatoria cuando el usuario solo tiene TOTP en un scope critico', () => {
    mfaStatus = { passkeysCount: 0, totpEnabled: true };
    render(
      <StepUpAuthModal
        open
        onOpenChange={() => {}}
        scope="platform.admin.create"
        onVerified={jest.fn()}
        allowedMethods={['PASSKEY']}
      />,
    );
    expect(screen.getByText(/requiere tu llave de seguridad/i)).toBeInTheDocument();
  });
});
