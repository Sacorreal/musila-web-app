'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Fingerprint, Loader2, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@shared/components/UI/button';
import { Input } from '@shared/components/UI/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@shared/components/UI/alert-dialog';

import { useRenamePasskey, useRevokePasskey } from '../hooks/security.hooks';
import type { PasskeySummary } from '../types/security.types';

/** Formatea el último uso en lenguaje natural relativo. */
function formatLastUsed(lastUsedAt: string | null): string {
  if (!lastUsedAt) return 'Nunca usada';
  const diffMs = Date.now() - new Date(lastUsedAt).getTime();
  const day = 24 * 60 * 60 * 1000;
  if (diffMs < day) return 'Hoy';
  if (diffMs < 2 * day) return 'Ayer';
  return `Hace ${Math.floor(diffMs / day)} días`;
}

export function PasskeyItem({ passkey }: { passkey: PasskeySummary }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(passkey.name ?? '');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const rename = useRenamePasskey();
  const revoke = useRevokePasskey();

  const handleRename = async () => {
    if (!name.trim()) return;
    try {
      await rename.mutateAsync({ id: passkey.id, name: name.trim() });
      toast.success('Passkey renombrada');
      setEditing(false);
    } catch (error) {
      toast.error((error as Error)?.message || 'No se pudo renombrar');
    }
  };

  const handleRevoke = async () => {
    try {
      await revoke.mutateAsync(passkey.id);
      toast.success('Passkey revocada');
    } catch (error) {
      toast.error((error as Error)?.message || 'No se pudo revocar');
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/40">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Fingerprint className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          {editing ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              autoFocus
              className="h-8"
              aria-label="Nuevo nombre de la Passkey"
            />
          ) : (
            <p className="truncate font-medium">{passkey.name || 'Passkey sin nombre'}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Último uso: {formatLastUsed(passkey.lastUsedAt)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {editing ? (
          <>
            <Button size="sm" onClick={handleRename} disabled={rename.isPending}>
              {rename.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              Guardar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setEditing(true)}
              aria-label="Renombrar Passkey"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setConfirmOpen(true)}
              aria-label="Revocar Passkey"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Revocar esta Passkey?</AlertDialogTitle>
            <AlertDialogDescription>
              El dispositivo dejará de poder iniciar sesión con esta Passkey. Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Revocar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
