'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Fingerprint, Loader2, Smartphone } from 'lucide-react';

import { Button } from '@shared/components/UI/button';
import { Input } from '@shared/components/UI/input';
import { Label } from '@shared/components/UI/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/components/UI/dialog';

import { useMfaStatus, useStepUp } from '../hooks/security.hooks';
import type { StepUpMethod } from '../types/security.types';

interface StepUpAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Ámbito de la operación sensible (ej. 'account.change_password'). */
  scope: string;
  /** Se invoca cuando el step-up se verifica correctamente. */
  onVerified: () => void;
  title?: string;
  description?: string;
  /**
   * Métodos que la política del scope permite (§15). Por defecto no restringe
   * (se ofrecen todos los que el usuario tenga enrolados). Los scopes CRITICAL
   * de Admin Musila deben pasar `['PASSKEY']` para reflejar que el backend
   * rechaza TOTP en esos scopes (`STEP_UP_METHOD_NOT_ALLOWED`).
   */
  allowedMethods?: StepUpMethod[];
}

/**
 * Modal reutilizable de autenticación adicional (§15). Resuelve el step-up con
 * Passkey o TOTP según los métodos disponibles del usuario y, al verificarse,
 * llama a `onVerified` para continuar con la operación sensible.
 */
export function StepUpAuthModal({
  open,
  onOpenChange,
  scope,
  onVerified,
  title = 'Verificación adicional',
  description = 'Confirma tu identidad para continuar con esta operación sensible.',
  allowedMethods,
}: StepUpAuthModalProps) {
  const { data: status } = useMfaStatus();
  const stepUp = useStepUp();
  const [code, setCode] = useState('');

  const passkeyAllowed = allowedMethods?.includes('PASSKEY') ?? true;
  const totpAllowed = allowedMethods?.includes('TOTP') ?? true;
  const canPasskey = passkeyAllowed && (status?.passkeysCount ?? 0) > 0;
  const canTotp = totpAllowed && (status?.totpEnabled ?? false);
  const passkeyOnly = !totpAllowed;

  const handleVerified = () => {
    toast.success('Verificación completada');
    setCode('');
    onOpenChange(false);
    onVerified();
  };

  const handlePasskey = async () => {
    try {
      await stepUp.mutateAsync({ scope, method: 'PASSKEY' });
      handleVerified();
    } catch (error) {
      const message =
        error instanceof Error && /cancel|abort|NotAllowed/i.test(error.message)
          ? 'Verificación cancelada'
          : (error as Error)?.message || 'No se pudo verificar';
      toast.error(message);
    }
  };

  const handleTotp = async () => {
    try {
      await stepUp.mutateAsync({ scope, method: 'TOTP', token: code.trim() });
      handleVerified();
    } catch (error) {
      toast.error((error as Error)?.message || 'Código inválido');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {canPasskey && (
            <Button className="w-full" onClick={handlePasskey} disabled={stepUp.isPending}>
              {stepUp.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Fingerprint className="mr-2 h-4 w-4" />
              )}
              Verificar con Passkey
            </Button>
          )}

          {canPasskey && canTotp && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> o <span className="h-px flex-1 bg-border" />
            </div>
          )}

          {canTotp && (
            <div className="space-y-2">
              <Label htmlFor="stepup-totp" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> Código de tu app de autenticación
              </Label>
              <div className="flex gap-2">
                <Input
                  id="stepup-totp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength={8}
                />
                <Button onClick={handleTotp} disabled={stepUp.isPending || code.length < 6}>
                  Verificar
                </Button>
              </div>
            </div>
          )}

          {!canPasskey && !canTotp && passkeyOnly && (
            <p className="text-sm text-muted-foreground">
              Esta operación requiere tu llave de seguridad (Passkey). Configura una en
              Configuración → Seguridad para poder continuar.
            </p>
          )}

          {!canPasskey && !canTotp && !passkeyOnly && (
            <p className="text-sm text-muted-foreground">
              No tienes métodos de verificación configurados. Añade una Passkey o configura
              TOTP en Configuración → Seguridad.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
