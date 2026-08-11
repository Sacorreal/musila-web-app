'use client';

import { ShieldCheck } from 'lucide-react';

import { Button } from '@shared/components/UI/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/UI/card';

import { PasskeyRegistration } from './PasskeyRegistration';

interface PasskeySetupProps {
  /** "Ahora no": permite continuar sin crear Passkey (usuarios personales, §9). */
  onSkip?: () => void;
  /** Se invoca al crear la Passkey correctamente. */
  onCreated?: () => void;
}

/**
 * Recomendación de Passkey mostrada tras verificar el email (§3.1, §9). En
 * usuarios personales la Passkey es opcional: "Ahora no" continúa el flujo.
 */
export function PasskeySetup({ onSkip, onCreated }: PasskeySetupProps) {
  return (
    <Card className="mx-auto max-w-md border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
      <CardHeader className="items-center text-center">
        <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <CardTitle>Protege tu cuenta con una Passkey</CardTitle>
        <CardDescription>
          Usa Face ID, huella, PIN o el método de seguridad de tu dispositivo para iniciar
          sesión de forma más rápida y segura.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <PasskeyRegistration
          triggerLabel="Crear Passkey"
          triggerVariant="default"
          onRegistered={onCreated}
        />
        <Button variant="ghost" onClick={onSkip}>
          Ahora no
        </Button>
      </CardContent>
    </Card>
  );
}
