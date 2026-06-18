"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/shared/components/UI/dialog";
import { Button } from "@/src/shared/components/UI/button";
import { CheckCircle2, CreditCard, Loader2, Music, XCircle } from "lucide-react";
import { TrackRequest } from "../types/request.types";
import { useLicenseCheckout, useLicensePaymentStatusPolling } from "@/src/domains/payments/payments.hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  request: TrackRequest;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = "info" | "processing" | "polling" | "success" | "failed";

const fmtCOP = (amount: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(amount);

interface CheckoutBreakdown {
  licensePrice: number;
  commission: number;
  total: number;
}

export function LicensePaymentModal({ isOpen, request, onClose, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("info");
  const [reference, setReference] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<CheckoutBreakdown | null>(null);

  const { mutate: startCheckout, isPending: isStarting } = useLicenseCheckout({
    onResult: (ref) => {
      setReference(ref);
      setStep("polling");
    },
  });

  const { data: statusData } = useLicensePaymentStatusPolling(
    step === "polling" ? reference : null
  );

  useEffect(() => {
    if (step !== "polling" || !statusData) return;
    if (statusData.status === "approved") {
      setStep("success");
      queryClient.invalidateQueries({ queryKey: ["requested-tracks"] });
      onSuccess?.();
    } else if (statusData.status === "failed") {
      setStep("failed");
    }
  }, [statusData, step, queryClient, onSuccess]);

  const handlePay = () => {
    setStep("processing");
    startCheckout(request.id, {
      onSuccess: (data) => {
        setBreakdown({ licensePrice: data.licensePrice, commission: data.commission, total: data.total });
        setReference(data.reference);
        setStep("polling");
      },
      onError: (error: any) => {
        toast.error(error?.message || "No se pudo iniciar el pago");
        setStep("info");
      },
    });
  };

  const handleClose = () => {
    if (step === "processing" || step === "polling") return;
    setStep("info");
    setReference(null);
    setBreakdown(null);
    onClose();
  };

  const handleRetry = () => {
    setStep("info");
    setReference(null);
    setBreakdown(null);
  };

  const licensePrice = Number(request.licensePrice || 0);
  const commission = breakdown?.commission ?? Math.round(licensePrice * 0.10);
  const total = breakdown?.total ?? (licensePrice + commission);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-3xl border-border/60 shadow-2xl overflow-hidden p-0">
        <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/40 w-full" />
        <div className="p-6 flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Pago de licencia
            </DialogTitle>
          </DialogHeader>

          {/* Track info */}
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/40">
            {request.track?.coverUrl ? (
              <img src={request.track.coverUrl} className="w-12 h-12 rounded-xl object-cover shadow" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Music size={22} className="text-primary" />
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Canción</p>
              <p className="font-black text-foreground">{request.track?.title}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step: info */}
            {step === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-col gap-5"
              >
                {/* Desglose de precios */}
                <div className="rounded-2xl border border-border/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/20">
                    <span className="text-sm text-muted-foreground">Precio de la licencia</span>
                    <span className="text-sm font-bold text-foreground">{fmtCOP(licensePrice)}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-t border-border/30">
                    <span className="text-sm text-muted-foreground">
                      Comisión Musila
                      <span className="ml-1.5 text-xs font-bold text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded-full">10%</span>
                    </span>
                    <span className="text-sm font-bold text-foreground">{fmtCOP(commission)}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-primary/20">
                    <span className="text-sm font-black uppercase tracking-wider text-primary">Total a pagar</span>
                    <span className="text-xl font-black text-primary">{fmtCOP(total)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Al pagar aceptas los términos de la licencia para el uso comercial de esta canción. Procesado en COP a través de Wompi.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 rounded-2xl font-bold h-12"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handlePay}
                    className="flex-1 rounded-2xl h-12 font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    <CreditCard size={18} className="mr-2" />
                    Pagar con Wompi
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step: processing */}
            {(step === "processing" || isStarting) && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <Loader2 size={48} className="animate-spin text-primary" />
                <p className="text-base font-bold text-foreground">Abriendo pasarela de pago...</p>
                <p className="text-sm text-muted-foreground text-center">
                  Se está abriendo el widget de Wompi. Completa el pago allí.
                </p>
              </motion.div>
            )}

            {/* Step: polling */}
            {step === "polling" && !isStarting && (
              <motion.div
                key="polling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <Loader2 size={48} className="animate-spin text-primary" />
                <p className="text-base font-bold text-foreground">Verificando pago...</p>
                <p className="text-sm text-muted-foreground text-center">
                  Esto puede tomar unos segundos. No cierres esta ventana.
                </p>
              </motion.div>
            )}

            {/* Step: success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                </div>
                <p className="text-xl font-black text-foreground">¡Pago exitoso!</p>
                <p className="text-sm text-muted-foreground text-center">
                  La licencia ha sido aprobada. Ya tienes los derechos de uso de esta canción.
                </p>
                <Button
                  onClick={() => { handleClose(); }}
                  className="rounded-2xl px-8 h-12 font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                >
                  Cerrar
                </Button>
              </motion.div>
            )}

            {/* Step: failed */}
            {step === "failed" && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle size={48} className="text-red-500" />
                </div>
                <p className="text-xl font-black text-foreground">Pago fallido</p>
                <p className="text-sm text-muted-foreground text-center">
                  No se pudo procesar el pago. Puedes intentarlo de nuevo.
                </p>
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 rounded-2xl font-bold h-12"
                  >
                    Cerrar
                  </Button>
                  <Button
                    onClick={handleRetry}
                    className="flex-1 rounded-2xl h-12 font-black"
                  >
                    Reintentar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
