import { MusilaLogo } from '@/src/shared/components/Icons/icons';
import { Button } from '@/src/shared/components/UI/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ErrorPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function ProErrorPage({ searchParams }: ErrorPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Link href="/" className="mb-12">
        <MusilaLogo className="h-10 w-auto text-primary" />
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-destructive/30 bg-card p-8 text-center">
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

        {params.ref && (
          <p className="mt-4 text-xs text-muted-foreground">
            Referencia: {params.ref}
          </p>
        )}
      </div>
    </div>
  );
}
