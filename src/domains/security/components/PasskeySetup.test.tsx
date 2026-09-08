import { render, screen, fireEvent } from '@testing-library/react';
import { PasskeySetup } from './PasskeySetup';

jest.mock('./PasskeyRegistration', () => ({
  PasskeyRegistration: ({ onRegistered }: { onRegistered?: () => void }) => (
    <button onClick={onRegistered}>Crear Passkey</button>
  ),
}));

describe('PasskeySetup', () => {
  it('muestra el copy de recomendación del §9', () => {
    render(<PasskeySetup />);
    expect(screen.getByText(/protege tu cuenta con una passkey/i)).toBeInTheDocument();
  });

  it('"Ahora no" invoca onSkip', () => {
    const onSkip = jest.fn();
    render(<PasskeySetup onSkip={onSkip} />);
    fireEvent.click(screen.getByRole('button', { name: /ahora no/i }));
    expect(onSkip).toHaveBeenCalled();
  });

  it('crear la Passkey invoca onCreated', () => {
    const onCreated = jest.fn();
    render(<PasskeySetup onCreated={onCreated} />);
    fireEvent.click(screen.getByRole('button', { name: /crear passkey/i }));
    expect(onCreated).toHaveBeenCalled();
  });
});
