"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { UserRole } from "@/src/domains/users/types/user.types";
import { ChevronRight, Loader2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrackRequestDetailsDialog } from "./TrackRequestDetailsDialog";
import { StatusBadge } from "./solicitudes/StatusBadge";

import { RequestStatus, TrackRequest } from "../types/request.types";





interface Props {
  trackId: string;
  authors: { id: string }[];
}

export function TrackRequestsTable({ trackId, authors }: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const [requests, setRequests] = useState<TrackRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Solo visible para el rol autor o cantautor Y si es el dueño del track
  const isAutor = role === UserRole.AUTOR || role === UserRole.CANTAUTOR;
  const isOwner = authors?.some((a) => a.id === user?.id) ?? false;
  const canSeeTable = isAutor && isOwner;

  // Estado para el modal de detalles
  const [selectedRequest, setSelectedRequest] = useState<TrackRequest | null>(null);

  useEffect(() => {
    if (!canSeeTable) return;
    apiClient
      .get<{ data: TrackRequest[]; total: number }>(apiURLs.requestedTracks.base)
      .then(({ data }) => {
        // Filtramos solo las solicitudes del track actual
        const filtered = (Array.isArray(data.data) ? data.data : []).filter(
          (r: any) => r.track?.id === trackId || r.trackId === trackId
        );
        setRequests(filtered);
      })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [trackId]);

  const handleRowClick = (req: TrackRequest) => {
    setSelectedRequest(req);
  };

  if (!canSeeTable) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-6">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Cargando solicitudes...</span>
      </div>
    );
  }

  return (
    <>
      <section className="mt-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Solicitudes recibidas</h2>

        <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="px-6 py-4">Artista</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Tipo de Licencia</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-sm text-muted-foreground">
                      Este track aún no ha recibido solicitudes.
                    </td>
                  </tr>
                )}

                {requests.map((req) => {
                  const requesterName = req.requester
                    ? `${req.requester.name} ${req.requester.lastName}`
                    : "—";
                  const date = req.createdAt
                    ? new Date(req.createdAt).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "—";

                  return (
                    <tr
                      key={req.id}
                      onClick={() => handleRowClick(req)}
                      className="group hover:bg-muted/30 transition-colors cursor-pointer border-b border-border last:border-0"
                    >
                      {/* Artista */}
                      <td className="px-6 py-5 text-sm font-semibold text-foreground">
                        {requesterName}
                      </td>

                      {/* Fecha */}
                      <td className="px-6 py-5 text-sm text-primary/80 font-medium">
                        {date}
                      </td>

                      {/* Tipo de licencia */}
                      <td className="px-6 py-5 text-sm text-muted-foreground capitalize">
                        {req.licenseType?.replace(/_/g, " ") ?? "—"}
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-5">
                        <StatusBadge status={req.status} />
                      </td>

                      {/* Acción */}
                      <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2 pr-4">
                           {req.chat?.id && (
                             <Link
                               href={`/music/chat?conversationId=${req.chat.id}`}
                               className="p-2 hover:bg-primary/10 text-primary rounded-xl transition-colors flex items-center gap-2 group/chat"
                               title="Ir al chat"
                             >
                               <MessageSquare size={18} className="group-hover/chat:scale-110 transition-transform" />
                               <span className="text-xs font-bold hidden sm:inline">Chat</span>
                             </Link>
                           )}
                           <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <TrackRequestDetailsDialog
        request={selectedRequest}
        isOpen={!!selectedRequest}
        isOwner={isOwner}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
}
