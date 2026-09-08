import { render, screen, fireEvent } from '@testing-library/react';
import { PasskeyList } from './PasskeyList';
import type { PasskeySummary } from '../types/security.types';

let usePasskeysResult: {
  data: PasskeySummary[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: jest.Mock;
};

jest.mock('../hooks/security.hooks', () => ({
  usePasskeys: () => usePasskeysResult,
}));

jest.mock('./PasskeyRegistration', () => ({
  PasskeyRegistration: () => <button>Agregar Passkey</button>,
}));

jest.mock('./PasskeyItem', () => ({
  PasskeyItem: ({ passkey }: { passkey: PasskeySummary }) => <div>{passkey.name}</div>,
}));

describe('PasskeyList', () => {
  beforeEach(() => {
    usePasskeysResult = { data: undefined, isLoading: false, isError: false, refetch: jest.fn() };
  });

  it('muestra el estado de carga', () => {
    usePasskeysResult.isLoading = true;
    render(<PasskeyList />);
    expect(screen.getByText(/cargando passkeys/i)).toBeInTheDocument();
  });

  it('muestra el estado de error con opción de reintentar', () => {
    usePasskeysResult.isError = true;
    render(<PasskeyList />);
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
    expect(usePasskeysResult.refetch).toHaveBeenCalled();
  });

  it('muestra el estado vacío cuando no hay Passkeys', () => {
    usePasskeysResult.data = [];
    render(<PasskeyList />);
    expect(screen.getByText(/aún no tienes passkeys/i)).toBeInTheDocument();
  });

  it('lista las Passkeys existentes', () => {
    usePasskeysResult.data = [
      { id: '1', name: 'iPhone personal', deviceType: 'singleDevice', createdAt: '', lastUsedAt: null },
      { id: '2', name: 'MacBook', deviceType: 'singleDevice', createdAt: '', lastUsedAt: null },
    ];
    render(<PasskeyList />);
    expect(screen.getByText('iPhone personal')).toBeInTheDocument();
    expect(screen.getByText('MacBook')).toBeInTheDocument();
  });
});
