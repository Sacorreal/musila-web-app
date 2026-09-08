import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PasskeyRegistration } from './PasskeyRegistration';

let supported = true;
const registerMock = jest.fn();

jest.mock('../client/passkey.client', () => ({
  isPasskeySupported: () => supported,
}));

jest.mock('../hooks/security.hooks', () => ({
  useRegisterPasskey: () => ({ mutateAsync: registerMock, isPending: false }),
}));

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('PasskeyRegistration', () => {
  beforeEach(() => {
    supported = true;
    registerMock.mockReset();
  });

  it('muestra un botón deshabilitado si el navegador no soporta Passkeys', () => {
    supported = false;
    render(<PasskeyRegistration />);
    expect(screen.getByRole('button', { name: /passkeys no disponibles/i })).toBeDisabled();
  });

  it('crea la Passkey con el nombre indicado y llama a onRegistered', async () => {
    registerMock.mockResolvedValue({ id: 'pk-1' });
    const onRegistered = jest.fn();
    render(<PasskeyRegistration onRegistered={onRegistered} />);

    fireEvent.click(screen.getByRole('button', { name: /agregar passkey/i }));
    fireEvent.change(screen.getByLabelText(/nombre del dispositivo/i), {
      target: { value: 'MacBook de trabajo' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^crear passkey$/i }));

    await waitFor(() => expect(registerMock).toHaveBeenCalledWith('MacBook de trabajo'));
    expect(onRegistered).toHaveBeenCalled();
  });

  it('no rompe si el usuario cancela la ceremonia del navegador', async () => {
    registerMock.mockRejectedValue(new Error('NotAllowedError: cancelled'));
    render(<PasskeyRegistration />);

    fireEvent.click(screen.getByRole('button', { name: /agregar passkey/i }));
    fireEvent.click(screen.getByRole('button', { name: /^crear passkey$/i }));

    await waitFor(() => expect(registerMock).toHaveBeenCalled());
  });
});
