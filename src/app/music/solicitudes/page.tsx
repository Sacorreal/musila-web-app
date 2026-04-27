"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { RequestStatus, TrackRequest } from "@/src/domains/requests/types/request.types";
import { 
  MessageSquare, 
  Download, 
  XCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Music,
  ChevronRight
} from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG: Record<RequestStatus, { label: string; color: string; icon: any }> = {
  [RequestStatus.PENDIENTE]: {
    label: "Pendiente",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  [RequestStatus.APROBADA]: {
    label: "Aprobada",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  [RequestStatus.RECHAZADA]: {
    label: "Rechazada",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: AlertCircle,
  },
  [RequestStatus.CANCELADA]: {
    label: "Cancelada",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    icon: XCircle,
  },
};

export default function RequestsPage() {
  const user = useAuthStore((s) => s.user);
  const [requests, setRequests] = useState<TrackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get<{ data: TrackRequest[]; total: number }>(
        apiURLs.requestedTracks.base
      );
      // Filtrar solicitudes enviadas por mí
      const myRequests = (data.data || []).filter(r => r.requester?.id === user?.id);
      setRequests(myRequests);
    } catch (error) {
      toast.error("Error al cargar tus solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta solicitud?")) return;
    
    setCancellingId(id);
    try {
      await apiClient.put(apiURLs.requestedTracks.byId(id), {
        status: RequestStatus.CANCELADA
      });
      toast.success("Solicitud cancelada correctamente");
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: RequestStatus.CANCELADA } : r));
    } catch (error) {
      toast.error("No se pudo cancelar la solicitud");
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownload = (track: any) => {
    if (!track?.audioUrl) {
      toast.error("El archivo de audio no está disponible");
      return;
    }
    window.open(track.audioUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Cargando tus solicitudes...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6 md:p-10 space-y-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">
          Mis Solicitudes
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestiona y haz seguimiento a tus peticiones de uso de canciones.
        </p>
      </header>

      <div className="bg-card/50 backdrop-blur-xl rounded-[2rem] border border-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                <th className="px-8 py-6">Canción</th>
                <th className="px-8 py-6">Fecha</th>
                <th className="px-8 py-6 text-center">Estado</th>
                <th className="px-8 py-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {requests.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={4} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <Music className="text-muted-foreground" size={32} />
                        </div>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
                          Aún no has realizado ninguna solicitud
                        </p>
                        <Button asChild variant="outline" className="mt-2 rounded-xl">
                          <Link href="/music">Explorar canciones</Link>
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  requests.map((req, index) => {
                    const status = STATUS_CONFIG[req.status] || STATUS_CONFIG[RequestStatus.PENDIENTE];
                    const StatusIcon = status.icon;

                    return (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-muted/30 transition-all duration-300"
                      >
                        {/* Canción */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 border border-border shadow-sm">
                              {req.track?.coverUrl ? (
                                <img src={req.track.coverUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Music size={18} className="text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                {req.track?.title || "Track Desconocido"}
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground opacity-70">
                                {req.licenseType?.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Fecha */}
                        <td className="px-8 py-6">
                          <span className="text-sm font-medium text-muted-foreground">
                            {new Date(req.createdAt).toLocaleDateString('es-CO', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="px-8 py-6">
                          <div className="flex justify-center">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                              <StatusIcon size={12} />
                              {status.label}
                            </div>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                            {/* Chat Link */}
                            {req.chat?.id && (
                              <Button 
                                asChild 
                                size="sm" 
                                variant="ghost" 
                                className="rounded-xl h-10 hover:bg-primary/10 hover:text-primary gap-2"
                              >
                                <Link href={`/music/chat?conversationId=${req.chat.id}`}>
                                  <MessageSquare size={18} />
                                  <span className="hidden sm:inline">Chat</span>
                                </Link>
                              </Button>
                            )}

                            {/* Download Button (Only if APPROVED) */}
                            {req.status === RequestStatus.APROBADA && (
                              <Button 
                                size="sm" 
                                className="rounded-xl h-10 bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shadow-lg shadow-emerald-500/20"
                                onClick={() => handleDownload(req.track)}
                              >
                                <Download size={18} />
                                <span className="hidden sm:inline">Descargar</span>
                              </Button>
                            )}

                            {/* Cancel Button (Only if PENDING) */}
                            {req.status === RequestStatus.PENDIENTE && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="rounded-xl h-10 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 gap-2"
                                onClick={() => handleCancelRequest(req.id)}
                                disabled={cancellingId === req.id}
                              >
                                {cancellingId === req.id ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : (
                                  <XCircle size={18} />
                                )}
                                <span className="hidden sm:inline">Cancelar</span>
                              </Button>
                            )}
                            
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0" />
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}