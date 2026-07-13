"use client";

import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/shared/components/UI/dialog";
import { Button } from "@/src/shared/components/UI/button";
import { Textarea } from "@/src/shared/components/UI/textarea";
import { Label } from "@/src/shared/components/UI/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/UI/select";
import { useRequestTrackFlow } from "@/src/domains/requests/hooks/use-request-track-flow.hook";
import { LicenseType } from "@/src/domains/tracks/types/track.types";
import { ConflictRequestError } from "@/src/domains/requests/services/requested-tracks.actions";
import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { RequestStatus, TrackRequest } from "../types/request.types";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { UserRole } from "@/src/domains/users/types/user.types";

interface RequestTrackModalProps {
  trackId: string;
  genreSlug?: string;
  children: React.ReactNode;
}

export function RequestTrackModal({ trackId, genreSlug, children }: RequestTrackModalProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isGuest = user?.role === UserRole.INVITADO;
  const [open, setOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [licenseType, setLicenseType] = useState<LicenseType | "">(LicenseType.LICENCIA_DE_PRIMER_USO);
  const { mutateAsync, isPending, uploadProgress, isConnectingSocket } = useRequestTrackFlow();
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [existingRequest, setExistingRequest] = useState<TrackRequest | null>(null);

  // Verificar si ya existe una solicitud al abrir el modal
  React.useEffect(() => {
    if (open) {
      setCheckingStatus(true);
      apiClient
        .get<{ data: any[]; total: number }>(apiURLs.requestedTracks.base)
        .then(({ data }) => {
          const found = (data.data || []).find(
            (r) => (r.track?.id === trackId || r.trackId === trackId) && r.status !== RequestStatus.RECHAZADA && r.status !== RequestStatus.CANCELADA
          );
          setExistingRequest(found);
        })
        .finally(() => setCheckingStatus(false));
    }
  }, [open, trackId]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !licenseType) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      await mutateAsync({
        trackId,
        message,
        licenseType: licenseType as LicenseType,
      });
      setIsSuccess(true);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        router.push("/music");
      }, 3000);
      
      // Reset form
      setMessage("");
      setLicenseType(LicenseType.LICENCIA_DE_PRIMER_USO);
    } catch (error: unknown) {
      if (error instanceof ConflictRequestError) {
        toast.error("Ya tienes una solicitud activa para esta canción.", {
          description: "No puedes enviar otra solicitud hasta que la actual sea respondida.",
        });
      } else {
        const msg = error instanceof Error ? error.message : "Ocurrió un error al enviar la solicitud.";
        toast.error(msg);
      }
    }
  };

  if (isGuest) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 bg-white dark:bg-slate-900 border-none rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-white">
              Solicitar Uso de la Canción
            </DialogTitle>
          </DialogHeader>
        </div>

        {checkingStatus ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-slate-500 font-medium">Verificando estado de solicitudes...</p>
          </div>
        ) : isSuccess ? (
          <div className="p-16 flex flex-col items-center text-center gap-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <CheckCircle2 className="w-12 h-12 text-white animate-bounce" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                ¡Solicitud Exitosa!
              </h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-sm">
                Tu solicitud ha sido enviada correctamente. El autor ha sido notificado.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Redirigiendo en unos segundos...
              </p>
              <Button 
                className="rounded-xl h-12 bg-slate-900 dark:bg-white dark:text-slate-900 font-bold"
                onClick={() => {
                  setOpen(false);
                  setIsSuccess(false);
                  router.push("/music");
                }}
              >
                Ir al Inicio
              </Button>
            </div>
          </div>
        ) : existingRequest ? (
          <div className="p-10 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <X className="w-10 h-10 text-amber-600 dark:text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Solicitud ya enviada</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Ya tienes una solicitud activa para esta canción. No es necesario enviar otra, el autor pronto te responderá a través del chat.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 rounded-xl px-8"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Textarea
              placeholder="Escribe tu mensaje aquí..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[160px] resize-none rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-base focus-visible:ring-blue-500/20"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Select value={licenseType} onValueChange={(val) => setLicenseType(val as LicenseType)} disabled={isPending}>
              <SelectTrigger className="w-full h-14 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-base focus:ring-blue-500/20">
                <SelectValue placeholder="Selecciona un tipo de licencia" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700">
                <SelectItem value={LicenseType.LICENCIA_DE_PRIMER_USO} className="text-base py-3 cursor-pointer">
                  <span className="capitalize">{LicenseType.LICENCIA_DE_PRIMER_USO}</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-6 rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-base"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base shadow-lg shadow-blue-500/25"
              disabled={isPending || !message || !licenseType}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isConnectingSocket ? "Conectando..." : "Enviando..."}
                </>
              ) : (
                "Enviar Solicitud"
              )}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
