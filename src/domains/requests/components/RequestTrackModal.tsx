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
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RequestTrackModalProps {
  trackId: string;
  children: React.ReactNode;
}

export function RequestTrackModal({ trackId, children }: RequestTrackModalProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [licenseType, setLicenseType] = useState<LicenseType | "">("");
  const [file, setFile] = useState<File | null>(null);

  const { mutateAsync, isPending, uploadProgress, isConnectingSocket } = useRequestTrackFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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
        file: file || undefined,
      });
      toast.success("¡Solicitud creada con éxito!", {
        description: "Espera la autorización del autor.",
      });
      setOpen(false);
      
      // Reset form
      setMessage("");
      setLicenseType("");
      setFile(null);
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
                {Object.values(LicenseType).map((type) => (
                  <SelectItem key={type} value={type} className="text-base py-3 cursor-pointer">
                    <span className="capitalize">{type}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Adjuntar documento (Opcional)
            </Label>
            
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium text-blue-600 dark:text-blue-400">
                    Sube un archivo <span className="text-slate-500 dark:text-slate-400 font-normal">o arrástralo y suéltalo</span>
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, GIF, PDF hasta 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/gif, application/pdf"
                  disabled={isPending}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => setFile(null)}
                  disabled={isPending}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
            
            {/* Progreso de subida */}
            {isPending && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
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
      </DialogContent>
    </Dialog>
  );
}
