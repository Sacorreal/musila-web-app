import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";

interface RegistrationErrorCardProps {
  reference?: string;
}

export function RegistrationErrorCard({ reference }: RegistrationErrorCardProps) {
  return (
    <div className="w-full rounded-2xl border border-destructive/30 bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" aria-hidden="true" />
      </div>

      <h1 className="text-xl font-bold text-foreground mb-2">No pudimos procesar tu pago</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Hubo un problema al confirmar tu pago. No se realizó ningún cargo. Puedes intentarlo nuevamente
        o contactarnos si el problema persiste.
      </p>

      <div className="flex flex-col gap-3">
        <Button asChild className="w-full">
          <Link href="/#pricing">Intentar nuevamente</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/register">Registrarme con plan gratuito</Link>
        </Button>
      </div>

      {reference && (
        <p className="mt-4 text-xs text-muted-foreground">
          Referencia: {reference}
        </p>
      )}
    </div>
  );
}
