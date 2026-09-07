'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { KeyRound, Loader2, ShieldCheck, Smartphone } from 'lucide-react';

import { Button } from '@shared/components/UI/button';
import { Badge } from '@shared/components/UI/badge';
import { Input } from '@shared/components/UI/input';
import { Label } from '@shared/components/UI/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/UI/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/UI/dialog';
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

import {
  useConfirmTotp,
  useDisableTotp,
  useMfaStatus,
  useSetupTotp,
} from '../hooks/security.hooks';
import type { TotpSetupResult } from '../types/security.types';

/** Estado MFA del usuario con configuración de TOTP como método alternativo. */
export function MfaStatus({ organizationId }: { organizationId?: string }) {
  const { data: status, isLoading } = useMfaStatus(organizationId);

  const setup = useSetupTotp();
  const confirm = useConfirmTotp();
  const disable = useDisableTotp();

  const [setupData, setSetupData] = useState<TotpSetupResult | null>(null);
  const [code, setCode] = useState('');
  const [disableOpen, setDisableOpen] = useState(false);

  const handleStartSetup = async () => {
    try {
      const data = await setup.mutateAsync();
      setSetupData(data);
    } catch (error) {
      toast.error((error as Error)?.message || 'No se pudo iniciar la configuración');
    }
  };

  const handleConfirm = async () => {
    try {
      await confirm.mutateAsync(code.trim());
      toast.success('TOTP activado');
      setSetupData(null);
      setCode('');
    } catch (error) {
      toast.error((error as Error)?.message || 'Código inválido');
    }
  };

  const handleDisable = async () => {
    try {
      await disable.mutateAsync();
      toast.success('TOTP desactivado');
    } catch (error) {
      toast.error((error as Error)?.message || 'No se pudo desactivar');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Autenticación en dos pasos (MFA)
        </CardTitle>
        <CardDescription>
          Añade una capa extra de seguridad además de tu contraseña.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando estado…
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Estado:</span>
              {status?.mfaEnabled ? (
                <Badge>MFA activa</Badge>
              ) : (
                <Badge variant="secondary">MFA inactiva</Badge>
              )}
              {status?.organizationPolicy?.mfaRequired && (
                <Badge variant={status.organizationPolicy.satisfied ? 'default' : 'destructive'}>
                  {status.organizationPolicy.satisfied
                    ? 'Cumple la política de la organización'
                    : 'Requerida por la organización'}
                </Badge>
              )}
            </div>

            {/* TOTP */}
            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Smartphone className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium">App de autenticación (TOTP)</p>
                  <p className="text-xs text-muted-foreground">
                    {status?.totpEnabled ? 'Configurada' : 'No configurada'}
                  </p>
                </div>
              </div>
              {status?.totpEnabled ? (
                <Button variant="outline" size="sm" onClick={() => setDisableOpen(true)}>
                  Desactivar
                </Button>
              ) : (
                <Button size="sm" onClick={handleStartSetup} disabled={setup.isPending}>
                  {setup.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Configurar
                </Button>
              )}
            </div>

            {/* Passkeys resumen */}
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <KeyRound className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium">Passkeys</p>
                <p className="text-xs text-muted-foreground">
                  {status?.passkeysCount ?? 0} activa(s) · {status?.recoveryCodesRemaining ?? 0}{' '}
                  código(s) de recuperación
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* Diálogo de configuración TOTP */}
      <Dialog open={!!setupData} onOpenChange={(o) => !o && setSetupData(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar app de autenticación</DialogTitle>
            <DialogDescription>
              Escanea el código QR con tu app (Google Authenticator, 1Password, etc.) e
              introduce el código de 6 dígitos.
            </DialogDescription>
          </DialogHeader>

          {setupData && (
            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={setupData.qrCodeDataUrl}
                alt="Código QR para configurar TOTP"
                className="h-44 w-44 rounded-lg border bg-white p-2"
              />
              <p className="break-all text-center text-xs text-muted-foreground">
                ¿No puedes escanear? Introduce esta clave: <br />
                <code className="font-mono">{setupData.manualEntryKey}</code>
              </p>
              <div className="w-full space-y-2">
                <Label htmlFor="totp-code">Código de verificación</Label>
                <Input
                  id="totp-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength={8}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setSetupData(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={confirm.isPending || code.length < 6}>
              {confirm.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmación de desactivación */}
      <AlertDialog open={disableOpen} onOpenChange={setDisableOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar TOTP?</AlertDialogTitle>
            <AlertDialogDescription>
              Perderás este método de verificación en dos pasos. Podrás volver a configurarlo
              más adelante.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
