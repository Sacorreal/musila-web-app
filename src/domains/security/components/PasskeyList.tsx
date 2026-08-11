'use client';

import { Fingerprint, Loader2, ShieldAlert } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/UI/card';

import { usePasskeys } from '../hooks/security.hooks';
import { PasskeyItem } from './PasskeyItem';
import { PasskeyRegistration } from './PasskeyRegistration';

/**
 * Listado de Passkeys del usuario con sus acciones (§13). Cubre los estados de
 * carga, vacío y error exigidos por los estándares UI del proyecto.
 */
export function PasskeyList() {
  const { data: passkeys, isLoading, isError, refetch } = usePasskeys();

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-primary" />
            Passkeys
          </CardTitle>
          <CardDescription>
            Inicia sesión sin contraseña con Face ID, huella o el método de tu dispositivo.
          </CardDescription>
        </div>
        <PasskeyRegistration triggerVariant="outline" />
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Cargando Passkeys…
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">
              No se pudieron cargar tus Passkeys.
            </p>
            <button
              onClick={() => refetch()}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !isError && passkeys?.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-8 text-center">
            <Fingerprint className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Aún no tienes Passkeys</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Protege tu cuenta agregando una Passkey. Podrás iniciar sesión de forma más
              rápida y segura.
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          passkeys?.map((passkey) => <PasskeyItem key={passkey.id} passkey={passkey} />)}
      </CardContent>
    </Card>
  );
}
