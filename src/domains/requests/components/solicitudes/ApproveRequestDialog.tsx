"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/UI/dialog";
import { Button } from "@/src/shared/components/UI/button";
import { TrackRequest } from "../../types/request.types";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  CloudUpload,
  FileCheck,
  FileSignature,
  FileText,
  Music,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/src/shared/libs/cn";
import { useUploadStorage } from "@/src/domains/storage/hooks/use-upload-storage";
import { UploadField } from "@/src/domains/storage/types/storage.types";
import { updateRequestedTrack } from "../../services/requested-tracks.actions";
import { RequestStatus } from "../../types/request.types";
import { toast } from "sonner";
import { OtpVerificationStep } from "@/src/shared/components/otp/OtpVerificationStep";
import { OtpPurpose } from "@/src/domains/otp/types/otp.types";
import { LicenseType } from "@/src/domains/tracks/types/track.types";

interface Props {
  isOpen: boolean;
  request: TrackRequest | null;
  onClose: () => void;
  onSuccess: (id: string) => void;
  /** Solo para licencias de primer uso: cierra este diálogo y abre el detalle de la solicitud para generar el contrato en línea. */
  onGenerateOnline?: () => void;
}

export function ApproveRequestDialog({ isOpen, request, onClose, onSuccess, onGenerateOnline }: Props) {
  const [step, setStep] = useState<"confirm" | "upload" | "otp">("confirm");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadStorage, progresses } = useUploadStorage();

  const handleClose = () => {
    if (isSaving) return;
    setStep("confirm");
    setFile(null);
    setIsDragging(false);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleApprove = async () => {
    if (!request) return;
    setIsSaving(true);
    try {
      let documentUrl: string | undefined = undefined;

      // Si hay archivo adjunto, lo subimos al storage antes de aprobar
      if (file) {
        const chatFolder = request.chat?.id
          ? `chat/${request.chat.id}/documents`
          : `documents/licenses`;

        const uploadResult = await uploadStorage([
          {
            field: "document" as UploadField,
            file,
            folder: chatFolder,
          },
        ]);

        const uploaded = uploadResult.find((r) => r.field === "document");
        if (uploaded) {
          documentUrl = uploaded.publicUrl;
        }
      }

      // Actualizamos la solicitud con solo los campos que el backend acepta
      await updateRequestedTrack(request.id, {
        status: RequestStatus.APROBADA,
        ...(documentUrl ? { documentUrl } : {}),
      } as any);

      toast.success("¡Solicitud aprobada exitosamente!");
      onSuccess(request.id);
      handleClose();
    } catch (err: any) {
      toast.error(err?.message ?? "No se pudo aprobar la solicitud");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadProgress = Math.round(progresses["document"] ?? 0);
  const isPrimerUso = request?.licenseType === LicenseType.LICENCIA_DE_PRIMER_USO;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      {/* hideCloseButton evita que DialogContent renderice su propia X */}
      <DialogContent
        className="max-w-lg p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:hidden"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Aprobar solicitud</DialogTitle>
        </DialogHeader>

        <div className="relative rounded-[2rem] overflow-hidden bg-card border border-border shadow-2xl">
          {/* Barra superior con gradiente en tonos azules */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

          <div className="p-8">
            {/* Header con botón X manual (único) */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground tracking-tight">
                    Aprobar solicitud
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">
                    Esta acción notificará al solicitante
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSaving}
                className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted disabled:opacity-40"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Track preview card */}
            {request && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 mb-8">
                {request.track?.coverUrl ? (
                  <img
                    src={request.track.coverUrl}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Music className="w-7 h-7 text-blue-600" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-0.5">
                    Canción solicitada
                  </p>
                  <p className="font-black text-foreground truncate">
                    {request.track?.title ?? "—"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    Solicitado por{" "}
                    <span className="font-bold text-foreground">
                      {request.requester?.name} {request.requester?.lastName}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Steps con AnimatePresence */}
            <AnimatePresence mode="wait">
              {step === "confirm" ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <ul className="space-y-2.5">
                    {[
                      "El solicitante podrá descargar el track una vez aprobado.",
                      "Puedes adjuntar un documento de licencia (opcional).",
                      "Esta acción puede revertirse rechazando la solicitud después.",
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>

                  {isPrimerUso ? (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs text-muted-foreground text-center">
                        Esta licencia requiere un documento firmado: genera el contrato en línea (recomendado) o
                        carga uno que hayas elaborado por fuera de la plataforma.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setStep("upload")}
                          disabled={isSaving}
                          className="flex-1 rounded-xl h-12 font-bold border-border hover:border-blue-400/50 hover:bg-blue-500/5 hover:text-blue-700 gap-2 transition-all"
                        >
                          <FileText size={16} />
                          Cargar licencia
                        </Button>
                        <Button
                          onClick={() => {
                            onGenerateOnline?.();
                            handleClose();
                          }}
                          disabled={isSaving}
                          className="flex-1 rounded-xl h-12 bg-violet-600 hover:bg-violet-700 text-white font-black tracking-tight shadow-lg shadow-violet-500/25 transition-all active:scale-95 gap-2"
                        >
                          <FileSignature size={16} />
                          Generar en línea
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setStep("upload")}
                        disabled={isSaving}
                        className="flex-1 rounded-xl h-12 font-bold border-border hover:border-blue-400/50 hover:bg-blue-500/5 hover:text-blue-700 gap-2 transition-all"
                      >
                        <FileText size={16} />
                        Adjuntar documento
                      </Button>
                      <Button
                        onClick={() => setStep("otp")}
                        disabled={isSaving}
                        className="flex-1 rounded-xl h-12 bg-blue-600 hover:bg-blue-700 text-white font-black tracking-tight shadow-lg shadow-blue-500/25 transition-all active:scale-95 gap-2"
                      >
                        <CheckCircle2 size={16} />
                        Aprobar ahora
                      </Button>
                    </div>
                  )}
                </motion.div>
              ) : step === "upload" ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 mb-2">
                      <CloudUpload size={14} />
                      Adjuntar documento de licencia
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Opcional — el documento se almacenará de forma segura y quedará visible para el solicitante.
                    </p>

                    {/* Drop zone */}
                    <label
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-36 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 group",
                        isDragging
                          ? "border-blue-500 bg-blue-500/5 scale-[1.01]"
                          : file
                          ? "border-blue-500/60 bg-blue-500/5"
                          : "border-border hover:border-blue-400/50 hover:bg-blue-500/5"
                      )}
                    >
                      {isSaving ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative w-12 h-12">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/30" />
                              <circle
                                cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor"
                                strokeWidth="2.5"
                                strokeDasharray={`${uploadProgress}, 100`}
                                strokeLinecap="round"
                                className="text-blue-600 transition-all duration-300"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-blue-600">
                              {uploadProgress}%
                            </span>
                          </div>
                          <p className="text-xs font-bold text-muted-foreground">Subiendo archivo...</p>
                        </div>
                      ) : file ? (
                        <>
                          <FileCheck className="w-8 h-8 text-blue-600 mb-2" />
                          <p className="text-sm font-bold text-foreground text-center px-4 line-clamp-1">{file.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black mt-1">Clic para cambiar</p>
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-8 h-8 text-muted-foreground group-hover:text-blue-600 transition-colors mb-2" />
                          <p className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                            Arrastra o haz clic para subir
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black mt-1">
                            PDF · JPG · PNG · DOCX
                          </p>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isSaving}
                        accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                      />
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => setStep("confirm")}
                      disabled={isSaving}
                      className="rounded-xl h-12 font-bold text-muted-foreground hover:text-foreground"
                    >
                      Volver
                    </Button>
                    <Button
                      onClick={() => setStep("otp")}
                      disabled={isSaving}
                      className="flex-1 rounded-xl h-12 bg-blue-600 hover:bg-blue-700 text-white font-black tracking-tight shadow-lg shadow-blue-500/25 transition-all active:scale-95 gap-2"
                    >
                      <CheckCircle2 size={16} />
                      {file ? "Subir y aprobar" : "Aprobar sin documento"}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <OtpVerificationStep
                  purpose={OtpPurpose.REQUESTED_TRACK_APPROVAL}
                  entityId={request?.id ?? ""}
                  active={step === "otp"}
                  onVerified={handleApprove}
                  onBack={() => setStep("confirm")}
                  title="Verifica tu identidad"
                  description="Por seguridad, confirma el código antes de aprobar esta solicitud."
                  isProcessing={isSaving}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
