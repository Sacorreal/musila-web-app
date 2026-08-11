'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, Loader2, RefreshCw, ShieldQuestion } from 'lucide-react';

import { Button } from '@shared/components/UI/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/UI/card';
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

import { useRegenerateRecoveryCodes } from '../hooks/security.hooks';

/**
 * Genera/regenera Recovery Codes (§6). Los códigos en claro se muestran una
 * única vez: regenerar invalida los anteriores. Nunca se vuelven a mostrar.
 */
export function RecoveryCodes() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [codes, setCodes] = useState<string[] | null>(null);
  const { mutateAsync, isPending } = useRegenerateRecoveryCodes();

  const handleRegenerate = async () => {
    try {
      const result = await mutateAsync();
      setCodes(result.codes);
      toast.success('Recovery Codes generados');
    } catch (error) {
      toast.error((error as Error)?.message || 'No se pudieron generar los códigos');
    }
  };

  const handleCopy = async () => {
    if (!codes) return;
    await navigator.clipboard.writeText(codes.join('\n'));
    toast.success('Códigos copiados al portapapeles');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldQuestion className="h-5 w-5 text-primary" />
          Códigos de recuperación
        </CardTitle>
        <CardDescription>
          Úsalos para acceder si pierdes tus otros métodos. Guárdalos en un lugar seguro.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {codes ? (
          <>
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {codes.map((code) => (
                  <span key={code} className="select-all">
                    {code}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-destructive">
              Esta es la única vez que verás estos códigos. Cópialos ahora.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copiar
              </Button>
              <Button variant="ghost" onClick={() => setCodes(null)}>
                Ya los guardé
              </Button>
            </div>
          </>
        ) : (
          <Button variant="outline" onClick={() => setConfirmOpen(true)} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Regenerar códigos
          </Button>
        )}
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Regenerar los códigos?</AlertDialogTitle>
            <AlertDialogDescription>
              Se invalidarán todos los códigos de recuperación anteriores. Asegúrate de
              guardar los nuevos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerate}>Regenerar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
