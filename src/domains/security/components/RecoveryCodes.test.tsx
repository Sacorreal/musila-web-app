import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecoveryCodes } from './RecoveryCodes';

const regenerateMock = jest.fn();
jest.mock('./../hooks/security.hooks', () => ({
  useRegenerateRecoveryCodes: () => ({ mutateAsync: regenerateMock, isPending: false }),
}));

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('RecoveryCodes', () => {
  beforeEach(() => regenerateMock.mockReset());

  it('muestra los códigos una sola vez tras regenerar', async () => {
    regenerateMock.mockResolvedValue({ codes: ['aaaa-bbbb', 'cccc-dddd'] });

    render(<RecoveryCodes />);

    fireEvent.click(screen.getByRole('button', { name: /regenerar códigos/i }));
    // Confirmación en el AlertDialog
    fireEvent.click(await screen.findByRole('button', { name: /^regenerar$/i }));

    await waitFor(() => expect(screen.getByText('aaaa-bbbb')).toBeInTheDocument());
    expect(screen.getByText('cccc-dddd')).toBeInTheDocument();
    expect(
      screen.getByText(/única vez que verás estos códigos/i),
    ).toBeInTheDocument();
  });
});
