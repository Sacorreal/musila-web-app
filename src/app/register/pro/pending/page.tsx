'use client';

import { MusilaLogo } from '@/src/shared/components/Icons/icons';
import { Button } from '@/src/shared/components/UI/button';
import { getPaymentStatus } from '@/src/domains/payments/payments.actions';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

const POLL_INTERVAL_MS = 3000;
const TIMEOUT_MS = 5 * 60 * 1000;

function PendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);
  const startedAt = useRef(Date.now());

  // Ref desde URL o recuperado de sessionStorage (si MP no redirigió automáticamente)
  const reference =
    searchParams.get('ref') ??
    (typeof window !== 'undefined' ? sessionStorage.getItem('mp_pending_ref') : null) ??
    '';

  const redirect = (ref: string, role: string) => {
    sessionStorage.removeItem('mp_pending_ref');
    sessionStorage.removeItem('mp_pending_role');
    router.replace(`/register/pro/complete?ref=${ref}&role=${role}`);
  };

  useEffect(() => {
    if (!reference) return;

    const check = async () => {
      if (Date.now() - startedAt.current > TIMEOUT_MS) {
        setTimedOut(true);
        return;
      }

      const status = await getPaymentStatus(reference);
      if (status.status === 'approved') {
        redirect(reference, status.role ?? '');
      } else if (status.status === 'expired' || status.status === 'not_found') {
        sessionStorage.removeItem('mp_pending_ref');
        sessionStorage.removeItem('mp_pending_role');
        router.replace(`/register/pro/error?ref=${reference}`);
      }
    };

    // Verificación inmediata al montar + polling cada 3 s
    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (timedOut) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          La verificación del pago tardó más de lo esperado.
        </p>
        <Button asChild variant="outline">
          <Link href="/register/pro/error">Ver opciones</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Cargando" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Verificando tu pago</h1>
      <p className="text-muted-foreground mb-1">
        Estamos confirmando tu pago con Mercado Pago.
      </p>
      <p className="text-sm text-muted-foreground">Esto puede tomar unos momentos...</p>
    </div>
  );
}

export default function PendingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Link href="/" className="mb-12">
        <MusilaLogo className="h-10 w-auto text-primary" />
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />}>
          <PendingContent />
        </Suspense>
      </div>
    </div>
  );
}
