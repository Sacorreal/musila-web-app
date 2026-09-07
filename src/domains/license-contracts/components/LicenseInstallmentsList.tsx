"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { useLicenseInstallmentCheckout } from "@/src/domains/payments/payments.hooks";
import {
  LICENSE_CONTRACT_INSTALLMENTS_QUERY_KEY,
  useLicenseContractInstallments,
} from "../hooks/license-contracts.hooks";

interface Props {
  contractId: string;
  isRequester: boolean;
  currency: string;
}

const fmt = (amount: number, currency: string) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount);

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  enlace_enviado: "Enlace enviado",
  pagado: "Pagada",
  en_mora: "En mora",
};

export function LicenseInstallmentsList({ contractId, isRequester, currency }: Props) {
  const queryClient = useQueryClient();
  const { data: installments, isLoading } = useLicenseContractInstallments(contractId);

  const { mutate: startCheckout, isPending } = useLicenseInstallmentCheckout({
    onResult: () => {
      toast.info("Verificando el pago, esto puede tomar unos segundos...");
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [LICENSE_CONTRACT_INSTALLMENTS_QUERY_KEY, contractId] });
      }, 4000);
    },
  });

  if (isLoading) return <div className="h-16 animate-pulse rounded-xl bg-muted/40" />;
  if (!installments?.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Cuotas del anticipo</p>
      {installments.map((installment) => (
        <div key={installment.id} className="flex items-center justify-between gap-3 rounded-xl border bg-muted/10 p-3 text-sm">
          <div>
            <p className="font-bold text-foreground">
              Cuota {installment.installmentNumber} · {fmt(installment.amount, currency)}
            </p>
            <p className="text-xs text-muted-foreground">Vence: {fmtDate(installment.dueDate)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">{STATUS_LABELS[installment.status]}</span>
            {isRequester && installment.status !== "pagado" && (
              <Button
                size="sm"
                onClick={() => startCheckout(installment.id)}
                disabled={isPending}
                className="gap-1.5 rounded-lg text-xs font-bold"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
                Pagar
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
