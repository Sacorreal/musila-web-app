'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Fingerprint, Loader2 } from 'lucide-react';

import { Button } from '@shared/components/UI/button';
import { Input } from '@shared/components/UI/input';
import { Label } from '@shared/components/UI/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/UI/dialog';

import { useRegisterPasskey } from '../hooks/security.hooks';
import { isPasskeySupported } from '../client/passkey.client';

interface PasskeyRegistrationProps {
  /** Etiqueta del botón disparador. */
  triggerLabel?: string;
  /** Variante visual del botón disparador. */
  triggerVariant?: 'default' | 'outline' | 'secondary';
  onRegistered?: () => void;
}

/**
 * Dispara la ceremonia de registro de Passkey. Pide un nombre legible para el
 * dispositivo antes de invocar al autenticador (§10, §13). El usuario nunca ve
 * ni introduce datos técnicos (challenge, RP ID, credentialId).
 */
export function PasskeyRegistration({
  triggerLabel = 'Agregar Passkey',
  triggerVariant = 'default',
  onRegistered,
}: PasskeyRegistrationProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { mutateAsync, isPending } = useRegisterPasskey();

  const supported = isPasskeySupported();

  const handleCreate = async () => {
    try {
      await mutateAsync(name.trim() || undefined);
      toast.success('Passkey creada correctamente');
      setName('');
      setOpen(false);
      onRegistered?.();
    } catch (error) {
      // El usuario puede cancelar la ceremonia del navegador: no es un fallo real.
      const message =
        error instanceof Error && /cancel|abort|NotAllowed/i.test(error.message)
          ? 'Registro cancelado'
          : (error as Error)?.message || 'No se pudo crear la Passkey';
      toast.error(message);
    }
  };

  if (!supported) {
    return (
      <Button variant="outline" disabled title="Tu navegador no soporta Passkeys">
        <Fingerprint className="mr-2 h-4 w-4" />
        Passkeys no disponibles
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>
          <Fingerprint className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear una Passkey</DialogTitle>
          <DialogDescription>
            Usa Face ID, huella, PIN o el método de seguridad de tu dispositivo. ¿Cómo
            quieres identificarla?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="passkey-name">Nombre del dispositivo</Label>
          <Input
            id="passkey-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="MacBook de trabajo"
            maxLength={100}
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Passkey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
