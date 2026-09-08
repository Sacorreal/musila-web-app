import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PasskeyItem } from './PasskeyItem';
import type { PasskeySummary } from '../types/security.types';

const renameMock = jest.fn();
const revokeMock = jest.fn();

jest.mock('../hooks/security.hooks', () => ({
  useRenamePasskey: () => ({ mutateAsync: renameMock, isPending: false }),
  useRevokePasskey: () => ({ mutateAsync: revokeMock, isPending: false }),
}));

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const passkey: PasskeySummary = {
  id: 'pk-1',
  name: 'iPhone personal',
  deviceType: 'singleDevice',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastUsedAt: null,
};

describe('PasskeyItem', () => {
  beforeEach(() => {
    renameMock.mockReset();
    revokeMock.mockReset();
  });

  it('muestra el nombre y "Nunca usada" cuando no tiene lastUsedAt', () => {
    render(<PasskeyItem passkey={passkey} />);
    expect(screen.getByText('iPhone personal')).toBeInTheDocument();
    expect(screen.getByText(/nunca usada/i)).toBeInTheDocument();
  });

  it('permite renombrar la Passkey', async () => {
    renameMock.mockResolvedValue({ ...passkey, name: 'MacBook de trabajo' });
    render(<PasskeyItem passkey={passkey} />);

    fireEvent.click(screen.getByRole('button', { name: /renombrar passkey/i }));
    fireEvent.change(screen.getByLabelText(/nuevo nombre de la passkey/i), {
      target: { value: 'MacBook de trabajo' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() =>
      expect(renameMock).toHaveBeenCalledWith({ id: 'pk-1', name: 'MacBook de trabajo' }),
    );
  });

  it('pide confirmación antes de revocar y solo revoca al confirmar', async () => {
    revokeMock.mockResolvedValue(undefined);
    render(<PasskeyItem passkey={passkey} />);

    fireEvent.click(screen.getByRole('button', { name: /revocar passkey/i }));
    expect(revokeMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /^revocar$/i }));

    await waitFor(() => expect(revokeMock).toHaveBeenCalledWith('pk-1'));
  });
});
