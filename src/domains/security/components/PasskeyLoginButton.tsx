'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Fingerprint, Loader2 } from 'lucide-react';

import { Button } from '@shared/components/UI/button';
import { usePasskeyLogin } from '../hooks/security.hooks';
import { isPasskeySupported } from '../client/passkey.client';

/**
 * Botón "Continuar con Passkey" para la pantalla de login (§11, §25). Ejecuta
 * la ceremonia WebAuthn y, si es válida, la sesión queda establecida por cookie
 * httpOnly desde el server action.
 */
export function PasskeyLoginButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync, isPending } = usePasskeyLogin();

  if (!isPasskeySupported()) return null;

  const handleLogin = async () => {
    try {
      await mutateAsync();
      toast.success('Bienvenido de vuelta');
      const returnUrl = searchParams.get('returnUrl');
      const isSafe = !!returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//');
      router.push(isSafe ? returnUrl! : '/music');
    } catch (error) {
      const message =
        error instanceof Error && /cancel|abort|NotAllowed/i.test(error.message)
          ? 'Inicio de sesión cancelado'
          : (error as Error)?.message || 'No se pudo iniciar sesión con Passkey';
      toast.error(message);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleLogin}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Fingerprint className="mr-2 h-4 w-4" />
      )}
      Continuar con Passkey
    </Button>
  );
}
