import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PasskeyLoginButton } from './PasskeyLoginButton';

let supported = true;
const loginMock = jest.fn();
const pushMock = jest.fn();
let returnUrl: string | null = null;

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => ({ get: (key: string) => (key === 'returnUrl' ? returnUrl : null) }),
}));

jest.mock('../client/passkey.client', () => ({
  isPasskeySupported: () => supported,
}));

jest.mock('../hooks/security.hooks', () => ({
  usePasskeyLogin: () => ({ mutateAsync: loginMock, isPending: false }),
}));

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('PasskeyLoginButton', () => {
  beforeEach(() => {
    supported = true;
    returnUrl = null;
    loginMock.mockReset();
    pushMock.mockReset();
  });

  it('no renderiza nada si el navegador no soporta Passkeys', () => {
    supported = false;
    const { container } = render(<PasskeyLoginButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it('al iniciar sesión correctamente, redirige a /music por defecto', async () => {
    loginMock.mockResolvedValue({ token: 't' });
    render(<PasskeyLoginButton />);

    fireEvent.click(screen.getByRole('button', { name: /continuar con passkey/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/music'));
  });

  it('redirige a un returnUrl relativo seguro si viene en la query', async () => {
    returnUrl = '/org/123/dashboard';
    loginMock.mockResolvedValue({ token: 't' });
    render(<PasskeyLoginButton />);

    fireEvent.click(screen.getByRole('button', { name: /continuar con passkey/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/org/123/dashboard'));
  });

  it('ignora un returnUrl no seguro (protocolo-relativo) y redirige a /music', async () => {
    returnUrl = '//evil.com';
    loginMock.mockResolvedValue({ token: 't' });
    render(<PasskeyLoginButton />);

    fireEvent.click(screen.getByRole('button', { name: /continuar con passkey/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/music'));
  });
});
