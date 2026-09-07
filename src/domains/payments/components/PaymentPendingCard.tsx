"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { usePaymentStatusPolling } from "@/src/domains/payments/payments.hooks";

const TIMEOUT_MS = 5 * 60 * 1000;

export function PaymentPendingCard() {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-8">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />}>
        <PaymentPendingContent />
      </Suspense>
    </div>
  );
}

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);
  const startedAt = useRef(Date.now());

  const reference =
    searchParams.get("ref") ??
    (typeof window !== "undefined" ? sessionStorage.getItem("wompi_pending_ref") : null) ??
    "";

  const { data: status } = usePaymentStatusPolling(reference || null);

  useEffect(() => {
    if (!reference) return;
    const timeout = setTimeout(() => setTimedOut(true), TIMEOUT_MS - (Date.now() - startedAt.current));
    return () => clearTimeout(timeout);
  }, [reference]);

  useEffect(() => {
    if (!status || !reference) return;

    if (status.status === "approved") {
      sessionStorage.removeItem("wompi_pending_ref");
      router.replace(`/register/pro/complete?ref=${reference}&planType=${status.planType ?? ""}`);
    } else if (status.status === "expired" || status.status === "not_found") {
      sessionStorage.removeItem("wompi_pending_ref");
      router.replace(`/register/pro/error?ref=${reference}`);
    }
  }, [status, reference, router]);

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
        Estamos confirmando tu pago con Wompi.
      </p>
      <p className="text-sm text-muted-foreground">Esto puede tomar unos momentos...</p>
    </div>
  );
}
