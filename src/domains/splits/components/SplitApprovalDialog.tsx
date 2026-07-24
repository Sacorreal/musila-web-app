"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ShieldCheck, ThumbsDown, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/shared/components/UI/dialog";
import { Button } from "@/src/shared/components/UI/button";
import { Textarea } from "@/src/shared/components/UI/textarea";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { OtpVerificationStep } from "@/src/shared/components/otp/OtpVerificationStep";
import { OtpPurpose } from "@/src/domains/otp/types/otp.types";
import { rejectSplitSchema, RejectSplitFormValues } from "../schema/splits.schema";
import { useApproveSplit, useRejectSplit } from "../hooks/splits.hooks";
import { COAUTHOR_ROLE_LABELS, SplitAuthorDto } from "../types/splits.types";

interface Props {
  isOpen: boolean;
  trackId: string;
  splitId: string;
  splitAuthor: SplitAuthorDto | null;
  onClose: () => void;
}

export function SplitApprovalDialog({ isOpen, trackId, splitId, splitAuthor, onClose }: Props) {
  const [step, setStep] = useState<"review" | "otp" | "reject">("review");

  const { mutate: approveSplit, isPending: isApproving } = useApproveSplit(trackId);
  const { mutate: rejectSplit, isPending: isRejecting } = useRejectSplit(trackId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectSplitFormValues>({
    resolver: zodResolver(rejectSplitSchema),
    mode: "onChange",
    defaultValues: { reason: "" },
  });

  const handleClose = () => {
    if (isApproving || isRejecting) return;
    setStep("review");
    reset({ reason: "" });
    onClose();
  };

  const handleApprove = () => {
    approveSplit(splitId, { onSuccess: handleClose });
  };

  const onReject = (values: RejectSplitFormValues) => {
    rejectSplit({ splitId, reason: values.reason }, { onSuccess: handleClose });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Revisar split de coautoría</DialogTitle>
        </DialogHeader>

        <div className="relative rounded-[2rem] overflow-hidden bg-card border border-border shadow-2xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400" />

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground tracking-tight">Split de coautoría</h2>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">
                    Revisa los términos antes de decidir
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isApproving || isRejecting}
                className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted disabled:opacity-40"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            {splitAuthor && (
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 mb-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-0.5">Tu participación</p>
                  <p className="font-black text-foreground">{COAUTHOR_ROLE_LABELS[splitAuthor.role]}</p>
                </div>
                <p className="text-3xl font-black text-foreground">{Number(splitAuthor.percentage)}%</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === "review" ? (
                <motion.div key="review" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Al aprobar, confirmas tu porcentaje de autoría y rol en esta canción. Necesitarás verificar un código de un solo uso.
                  </p>
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
                      className="flex-1 rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Aprobar
                    </Button>
                  </div>
                </motion.div>
              ) : step === "otp" ? (
                <OtpVerificationStep
                  purpose={OtpPurpose.SPLIT_SIGNING}
                  entityId={splitId}
                  active={step === "otp"}
                  onVerified={handleApprove}
                  onBack={() => setStep("review")}
                  title="Confirma tu firma"
                  description="Verifica el código para firmar tu participación en el split."
                  isProcessing={isApproving}
                />
              ) : (
                <motion.form key="reject" onSubmit={handleSubmit(onReject)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5" noValidate>
                  <Field data-invalid={!!errors.reason}>
                    <FieldLabel>Motivo del rechazo</FieldLabel>
                    <Textarea
                      {...register("reason")}
                      rows={4}
                      placeholder="Explica por qué rechazas tu inclusión en este split..."
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
