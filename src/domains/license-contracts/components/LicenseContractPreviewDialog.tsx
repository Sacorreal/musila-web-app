"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ExternalLink, FileText, ShieldCheck, ThumbsDown, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/shared/components/UI/dialog";
import { Button } from "@/src/shared/components/UI/button";
import { Textarea } from "@/src/shared/components/UI/textarea";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { OtpVerificationStep } from "@/src/shared/components/otp/OtpVerificationStep";
import { OtpPurpose } from "@/src/domains/otp/types/otp.types";
import { rejectLicenseSignatorySchema, RejectLicenseSignatoryFormValues } from "../schema/license-contract.schema";
import { useRejectLicenseContractSignatory, useSignLicenseContract } from "../hooks/license-contracts.hooks";
import {
  DISTRIBUTION_FORMAT_LABELS,
  LicenseContractDto,
  LicenseContractSignatoryDto,
  LicenseTerritoryMode,
  SIGNATORY_ROLE_LABELS,
} from "../types/license-contract.types";

interface Props {
  isOpen: boolean;
  requestedTrackId: string;
  trackTitle: string;
  contract: LicenseContractDto;
  signatory: LicenseContractSignatoryDto;
  onClose: () => void;
}

const fmtCOP = (amount: number, currency: string) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount);

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

export function LicenseContractPreviewDialog({
  isOpen,
  requestedTrackId,
  trackTitle,
  contract,
  signatory,
  onClose,
}: Props) {
  const [step, setStep] = useState<"review" | "otp" | "reject">("review");
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { mutate: signContract, isPending: isSigning } = useSignLicenseContract(requestedTrackId);
  const { mutate: rejectContract, isPending: isRejecting } = useRejectLicenseContractSignatory(requestedTrackId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectLicenseSignatoryFormValues>({
    resolver: zodResolver(rejectLicenseSignatorySchema),
    mode: "onChange",
    defaultValues: { reason: "" },
  });

  const handleClose = () => {
    if (isSigning || isRejecting) return;
    setStep("review");
    setHasScrolledToBottom(false);
    reset({ reason: "" });
    onClose();
  };

  const handleSign = () => {
    signContract({ contractId: contract.id, signatoryId: signatory.id }, { onSuccess: handleClose });
  };

  const onReject = (values: RejectLicenseSignatoryFormValues) => {
    rejectContract(
      { contractId: contract.id, signatoryId: signatory.id, reason: values.reason },
      { onSuccess: handleClose },
    );
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const reachedBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 24;
    if (reachedBottom) setHasScrolledToBottom(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Contrato de licencia de primer uso</DialogTitle>
        </DialogHeader>

        <div className="relative rounded-[2rem] overflow-hidden bg-card border border-border shadow-2xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-400" />

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground tracking-tight">Licencia de primer uso</h2>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">
                    Firmas como {SIGNATORY_ROLE_LABELS[signatory.role]}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSigning || isRejecting}
                className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted disabled:opacity-40"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {step === "review" ? (
                <motion.div key="review" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    Revisa los términos clave de "{trackTitle}" hasta el final antes de firmar.
                  </p>

                  <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="max-h-72 overflow-y-auto space-y-3 rounded-2xl border bg-muted/10 p-4 text-sm"
                  >
                    <SummaryRow label="Vigencia (plazo para ISRC)" value={fmtDate(contract.validityDate)} />
                    <SummaryRow
                      label="Territorio"
                      value={
                        contract.territoryMode === LicenseTerritoryMode.GLOBAL
                          ? "Mundial"
                          : (contract.territoryCountries ?? []).join(", ") || "Por definir"
                      }
                    />
                    <SummaryRow
                      label="Anticipo"
                      value={
                        contract.advanceAmount > 0
                          ? `${fmtCOP(contract.advanceAmount, contract.advanceCurrency)} (+ comisión Músila ${fmtCOP(contract.commissionAmount, contract.advanceCurrency)} = ${fmtCOP(contract.totalPayableByLicensee, contract.advanceCurrency)} a cargo del intérprete)`
                          : "Sin anticipo"
                      }
                    />
                    {contract.advanceInstallments && contract.advanceInstallments.length > 0 && (
                      <SummaryRow
                        label="Cuotas"
                        value={contract.advanceInstallments
                          .map((i, idx) => `Cuota ${idx + 1}: ${fmtCOP(i.amount, contract.advanceCurrency)} (${fmtDate(i.dueDate)})`)
                          .join(" · ")}
                      />
                    )}
                    <SummaryRow label="Regalía sobre el master" value={`${contract.royaltyPercentage}%`} />
                    <SummaryRow
                      label="Formatos de distribución autorizados"
                      value={contract.distributionFormats.map((f) => DISTRIBUTION_FORMAT_LABELS[f]).join(", ")}
                    />
                    <SummaryRow
                      label="Firmantes"
                      value={contract.signatories.map((s) => `${s.user.name} ${s.user.lastName} (${SIGNATORY_ROLE_LABELS[s.role]})`).join(", ")}
                    />
                    <p className="pt-2 text-xs text-muted-foreground">
                      Esta licencia no cede la titularidad de los derechos patrimoniales de la obra; solo autoriza la
                      primera grabación y distribución en los formatos indicados, conforme a la Ley 23 de 1982 y la
                      Ley 527 de 1999 (firma electrónica).
                    </p>
                  </div>

                  {contract.documentUrl && (
                    <a
                      href={contract.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Ver documento completo (PDF)
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {!hasScrolledToBottom && (
                    <p className="text-xs font-semibold text-amber-600">Desplázate hasta el final del resumen para continuar.</p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep("reject")}
                      className="flex-1 rounded-xl h-12 font-bold gap-2 border-destructive/30 text-destructive hover:bg-destructive/5"
                    >
                      <ThumbsDown size={16} />
                      Rechazar
                    </Button>
                    <Button
                      onClick={() => setStep("otp")}
                      disabled={!hasScrolledToBottom}
                      className="flex-1 rounded-xl h-12 bg-violet-600 hover:bg-violet-700 text-white font-black gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Firmar y aceptar
                    </Button>
                  </div>
                </motion.div>
              ) : step === "otp" ? (
                <OtpVerificationStep
                  purpose={OtpPurpose.LICENSE_CONTRACT_SIGNING}
                  entityId={signatory.id}
                  active={step === "otp"}
                  onVerified={handleSign}
                  onBack={() => setStep("review")}
                  title="Confirma tu firma"
                  description="Verifica el código para firmar electrónicamente el contrato de licencia."
                  isProcessing={isSigning}
                />
              ) : (
                <motion.form
                  key="reject"
                  onSubmit={handleSubmit(onReject)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                  noValidate
                >
                  <Field data-invalid={!!errors.reason}>
                    <FieldLabel>Motivo del rechazo</FieldLabel>
                    <Textarea
                      {...register("reason")}
                      rows={4}
                      placeholder="Explica por qué rechazas este contrato..."
                      disabled={isRejecting}
                    />
                    {errors.reason && <FieldError errors={[errors.reason]} />}
                  </Field>
                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep("review")} disabled={isRejecting} className="rounded-xl h-12 font-bold">
                      Volver
                    </Button>
                    <Button type="submit" disabled={isRejecting} className="flex-1 rounded-xl h-12 bg-destructive hover:bg-destructive/90 text-white font-black gap-2">
                      <ThumbsDown size={16} />
                      Confirmar rechazo
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}
