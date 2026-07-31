"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/components/UI/avatar";
import { Badge } from "@/src/shared/components/UI/badge";
import { Button } from "@/src/shared/components/UI/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/src/shared/components/UI/select";
import { TrackRequest, RequestStatus } from "../types/request.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CloudUpload, FileText, Loader2, Music, User, Calendar, FileCheck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useUploadStorage } from "@/src/domains/storage/hooks/use-upload-storage";
import { StorageFolder, UploadField } from "@/src/domains/storage/types/storage.types";
import { toast } from "sonner";
import { updateRequestedTrack } from "../services/requested-tracks.actions";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/src/shared/libs/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { LicenseContractSection } from "@/src/domains/license-contracts/components/LicenseContractSection";
// import { LicensePaymentModal } from "./LicensePaymentModal"; // PRECIO DE LICENCIA — EN PAUSA

interface Props {
  request: TrackRequest;
  isOwner: boolean;
  onClose?: () => void;
}

const fmtCOP = (amount: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(amount);

export function TrackRequestDetails({ request, isOwner, onClose }: Props) {
  const queryClient = useQueryClient();
  const { mutateAsync: uploadStorage, progresses } = useUploadStorage();

  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  /* PRECIO DE LICENCIA — EN PAUSA
  const fmtThousands = (raw: string) =>
    raw.replace(/\./g, "").replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const [priceInput, setPriceInput] = useState<string>(
    request.licensePrice ? fmtThousands(String(Math.round(Number(request.licensePrice)))) : ""
  );
  const [priceCurrency, setPriceCurrency] = useState<"COP" | "USD">("COP");
  const [showPriceEdit, setShowPriceEdit] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  */

  const user = useAuthStore((s) => s.user);
  const isRequester = user?.id === request.requester?.id;
  const canCancel = isRequester && request.status === RequestStatus.PENDIENTE;
  const canOwnerApproveDirectly = isOwner;

  /* PRECIO DE LICENCIA — EN PAUSA
  const hasPriceSet = request.licensePrice !== null && request.licensePrice !== undefined;
  const canRequesterPay = isRequester && request.status === RequestStatus.PENDIENTE && hasPriceSet && request.licensePaymentStatus !== "approved";
  const rawPriceValue = parseInt(priceInput.replace(/\./g, ""), 10) || 0;
  const currentPriceRaw = Math.round(Number(request.licensePrice || 0));
  const priceChanged = isOwner && rawPriceValue > 0 && rawPriceValue !== currentPriceRaw;
  */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      /* PRECIO DE LICENCIA — EN PAUSA
      if (priceChanged) {
        const priceInCOP = priceCurrency === "USD" ? Math.round(rawPriceValue * 4100) : rawPriceValue;
        await setLicensePrice(request.id, priceInCOP);
        setShowPriceEdit(false);
      }
      */

      if (status !== request.status || file) {
        let documentUrl = request.documentUrl;

        if (file && status === RequestStatus.APROBADA) {
          if (!request.chat?.id) {
            throw new Error("No se encontró el chat asociado para subir la licencia.");
          }

          const uploadResult = await uploadStorage([{
            field: "document" as UploadField,
            file: file,
            folder: `chat/${request.chat.id}/documents` as any,
          }]);

          const licenseUpload = uploadResult.find((r) => r.field === "document");
          if (licenseUpload) documentUrl = licenseUpload.publicUrl;
        }

        await updateRequestedTrack(request.id, {
          status,
          ...(documentUrl ? { documentUrl } : {}),
        } as any);
      }

      toast.success("Cambios guardados correctamente");
      queryClient.invalidateQueries({ queryKey: ["requested-tracks"] });
      if (onClose) onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const statusIcons = {
    [RequestStatus.PENDIENTE]: <Clock className="w-4 h-4 text-amber-500" />,
    [RequestStatus.APROBADA]: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    [RequestStatus.RECHAZADA]: <XCircle className="w-4 h-4 text-red-500" />,
    [RequestStatus.CANCELADA]: <Clock className="w-4 h-4 text-slate-500" />,
  };

  return (
    <div className="flex flex-col gap-8 p-1 md:p-4">
      {/* User Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-16 h-16 border-2 border-primary/20 shadow-xl">
            <AvatarImage src={request.requester?.avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User size={32} />
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full shadow-lg border border-border">
            {statusIcons[request.status]}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            {request.requester?.name} {request.requester?.lastName}
          </h2>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <FileText size={14} /> Solicitante
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-muted/30 p-6 rounded-[1.5rem] border border-border/50">
        <p className="text-foreground/90 leading-relaxed italic">
          "Hola, soy un interesado en tu música. Me gustaría utilizar tu canción '{request.track?.title}' para mi proyecto. Es una pieza increíble."
        </p>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Licencia */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <FileCheck size={16} /> Detalle de la licencia
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <span className="text-muted-foreground text-sm">Tipo de Licencia</span>
              <span className="font-bold text-sm uppercase">{request.licenseType}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <span className="text-muted-foreground text-sm">Fecha de solicitud</span>
              <span className="font-bold text-sm">
                {format(new Date(request.createdAt), "MMMM d, yyyy", { locale: es })}
              </span>
            </div>
          </div>
        </div>

        {/* Canción */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <Music size={16} /> Detalle de la Canción
          </h3>
          <div className="bg-slate-500/5 p-4 rounded-2xl flex items-center gap-4 border border-border/30">
            {request.track?.coverUrl ? (
              <img src={request.track.coverUrl} className="w-12 h-12 rounded-xl object-cover shadow-md" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Music size={24} />
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Título</p>
              <p className="font-black text-foreground">{request.track?.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PRECIO DE LICENCIA — EN PAUSA
      <AnimatePresence>
        {isOwner && request.status === RequestStatus.PENDIENTE && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Tag size={16} /> Precio de licencia
            </h3>
            {hasPriceSet && !showPriceEdit ? (
              <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Precio establecido</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{fmtCOP(Number(request.licensePrice))}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowPriceEdit(true)} className="rounded-xl font-bold text-xs">
                  Editar
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button onClick={() => setPriceCurrency("COP")} className={cn("flex-1 py-2 rounded-xl text-sm font-bold border transition-all", priceCurrency === "COP" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/50")}>COP</button>
                  <button onClick={() => setPriceCurrency("USD")} className={cn("flex-1 py-2 rounded-xl text-sm font-bold border transition-all", priceCurrency === "USD" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/50")}>USD</button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">{priceCurrency === "COP" ? "$" : "USD"}</span>
                    <input type="text" inputMode="numeric" value={priceInput} onChange={(e) => setPriceInput(fmtThousands(e.target.value))} placeholder="0" className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-border bg-background font-bold text-foreground focus:outline-none focus:border-primary transition-all" />
                  </div>
                  {showPriceEdit && (<Button variant="ghost" onClick={() => setShowPriceEdit(false)} className="rounded-2xl px-3 h-12 font-bold text-xs">Cancelar</Button>)}
                </div>
                {priceCurrency === "USD" && priceInput && parseFloat(priceInput.replace(/\./g, "")) > 0 && (
                  <p className="text-xs text-muted-foreground text-center">≈ {fmtCOP(Math.round(parseFloat(priceInput.replace(/\./g, "")) * 4100))} COP (estimado)</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {canRequesterPay && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="rounded-2xl border border-primary/25 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-muted/20">
              <span className="text-xs text-muted-foreground">Precio de la licencia</span>
              <span className="text-sm font-bold">{fmtCOP(Number(request.licensePrice))}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3 bg-muted/20 border-t border-border/30">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">Comisión Musila <span className="text-xs font-bold text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded-full">10%</span></span>
              <span className="text-sm font-bold">{fmtCOP(Math.round(Number(request.licensePrice) * 0.10))}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4 bg-primary/5 border-t border-primary/20">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Total a pagar</p>
                <p className="text-2xl font-black text-primary">{fmtCOP(Math.round(Number(request.licensePrice) * 1.10))}</p>
              </div>
              <Button onClick={() => setShowPaymentModal(true)} className="rounded-2xl h-12 px-6 font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 whitespace-nowrap">
                <DollarSign size={16} className="mr-1" /> Aceptar y pagar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      */}

      {/* Status Update (Only for Owner) */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-primary">Estado Solicitud</h3>
        {isOwner ? (
          <Select
            value={status}
            onValueChange={(val) => setStatus(val as RequestStatus)}
            disabled={isSaving}
          >
            <SelectTrigger className="h-14 rounded-2xl border-2 focus:ring-primary/20 bg-background font-bold text-base transition-all">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-2xl border-border">
              <SelectItem value={RequestStatus.PENDIENTE} className="py-3 font-medium">Pendiente</SelectItem>
              {canOwnerApproveDirectly && (
                <SelectItem value={RequestStatus.APROBADA} className="py-3 font-bold text-emerald-600 dark:text-emerald-400">Aprobar Solicitud</SelectItem>
              )}
              <SelectItem value={RequestStatus.RECHAZADA} className="py-3 font-bold text-red-600 dark:text-red-400">Rechazar Solicitud</SelectItem>
            </SelectContent>
          </Select>
        ) : canCancel ? (
          <Select 
            value={status} 
            onValueChange={(val) => setStatus(val as RequestStatus)}
            disabled={isSaving}
          >
            <SelectTrigger className="h-14 rounded-2xl border-2 focus:ring-primary/20 bg-background font-bold text-base transition-all border-amber-500/30">
              <SelectValue placeholder="Gestionar mi solicitud" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-2xl border-border">
              <SelectItem value={RequestStatus.PENDIENTE} className="py-3 font-medium">Pendiente (Enviada)</SelectItem>
              <SelectItem value={RequestStatus.CANCELADA} className="py-3 font-bold text-red-600 dark:text-red-400">Cancelar Solicitud</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 rounded-2xl border border-border/50">
            {statusIcons[request.status]}
            <span className="font-bold uppercase text-sm tracking-widest">{request.status}</span>
          </div>
        )}
      </div>

      {/* Upload License (Only if Approved and Owner) */}
      <AnimatePresence>
        {isOwner && status === RequestStatus.APROBADA && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <CloudUpload size={16} /> Cargar licencia (Opcional)
            </h3>
            <label className={cn(
              "flex flex-col items-center justify-center w-full h-32 px-4 transition bg-background border-2 border-dashed rounded-[1.5rem] cursor-pointer hover:border-primary/50 hover:bg-primary/5 group",
              file ? "border-primary bg-primary/5" : "border-border"
            )}>
              <div className="flex flex-col items-center justify-center py-2">
                {isSaving ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-xs font-bold text-primary">{Math.round(progresses["license"] || 0)}%</p>
                  </div>
                ) : file ? (
                  <>
                    <FileCheck className="w-8 h-8 text-primary mb-1" />
                    <p className="text-sm font-bold text-foreground text-center line-clamp-1">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Clic para cambiar</p>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                    <p className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Click to upload</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Formatos: PDF, JPG, PNG</p>
                  </>
                )}
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} disabled={isSaving} accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <LicenseContractSection request={request} isOwner={isOwner} />

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 mt-4">
        {onClose && (
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl font-bold uppercase text-xs tracking-widest"
          >
            Cancelar
          </Button>
        )}
        {(isOwner || canCancel) && (
          <Button
            onClick={handleSave}
            disabled={isSaving || (status === request.status && !file)}
            className="rounded-2xl px-10 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-tighter text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                Guardando...
              </div>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        )}
      </div>

      {/* PRECIO DE LICENCIA — EN PAUSA
      {showPaymentModal && (
        <LicensePaymentModal
          isOpen={showPaymentModal}
          request={request}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => setShowPaymentModal(false)}
        />
      )}
      */}
    </div>
  );
}
