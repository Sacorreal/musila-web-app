import { render, screen, fireEvent } from '@testing-library/react';
import { VerifyEmailStatus } from './VerifyEmailStatus';

let emailVerificationState: { status: 'loading' | 'success' | 'error'; message: string };
let isAuthenticated: boolean;

jest.mock('../hooks/use-email-verification', () => ({
  useEmailVerification: () => emailVerificationState,
}));

jest.mock('../store/use-auth-store', () => ({
  useAuthStore: (selector: (s: { isAuthenticated: boolean }) => unknown) =>
    selector({ isAuthenticated }),
}));

jest.mock('@domains/security/components/PasskeySetup', () => ({
  PasskeySetup: ({ onSkip, onCreated }: { onSkip: () => void; onCreated: () => void }) => (
    <div>
      <p>Protege tu cuenta con una Passkey</p>
      <button onClick={onCreated}>Crear Passkey</button>
      <button onClick={onSkip}>Ahora no</button>
    </div>
  ),
}));

describe('VerifyEmailStatus', () => {
  beforeEach(() => {
    emailVerificationState = { status: 'success', message: 'Tu correo fue verificado.' };
    isAuthenticated = false;
  });

  it('con sesión activa, muestra la recomendación de Passkey en vez del botón "Ir a Músila"', () => {
    isAuthenticated = true;
    render(<VerifyEmailStatus />);

    expect(screen.getByText(/protege tu cuenta con una passkey/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /ir a músila/i })).not.toBeInTheDocument();
  });

  it('sin sesión (verificación desde otro dispositivo), no muestra la recomendación de Passkey', () => {
    isAuthenticated = false;
    render(<VerifyEmailStatus />);

    expect(screen.queryByText(/protege tu cuenta con una passkey/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ir a músila/i })).toBeInTheDocument();
  });

  it('al omitir la Passkey, continúa hacia la confirmación con el botón "Ir a Músila"', () => {
    isAuthenticated = true;
    render(<VerifyEmailStatus />);

    fireEvent.click(screen.getByRole('button', { name: /ahora no/i }));

    expect(screen.getByRole('link', { name: /ir a músila/i })).toBeInTheDocument();
  });

  it('al crear la Passkey, continúa hacia la confirmación con el botón "Ir a Músila"', () => {
    isAuthenticated = true;
    render(<VerifyEmailStatus />);

    fireEvent.click(screen.getByRole('button', { name: /crear passkey/i }));

    expect(screen.getByRole('link', { name: /ir a músila/i })).toBeInTheDocument();
  });

  it('rama de error: no muestra la recomendación de Passkey', () => {
    isAuthenticated = true;
    emailVerificationState = { status: 'error', message: 'El enlace ha expirado.' };
    render(<VerifyEmailStatus />);

    expect(screen.queryByText(/protege tu cuenta con una passkey/i)).not.toBeInTheDocument();
    expect(screen.getByText(/enlace inválido/i)).toBeInTheDocument();
  });
});
