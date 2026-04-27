"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { UserRole } from "@/src/domains/users/types/user.types";
import { MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { RequestStatus, TrackRequest } from "../types/request.types";

const STATUS_CONFIG: Record<RequestStatus, { label: string; color: string }> = {
  [RequestStatus.PENDIENTE]: {
    label: "Pendiente",
    color: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  },
  [RequestStatus.APROBADA]: {
    label: "Aprobada",
    color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  },
  [RequestStatus.RECHAZADA]: {
    label: "Rechazada",
    color: "bg-rose-500/15 text-rose-500 border-rose-500/30",
  },
  [RequestStatus.CANCELADA]: {
    label: "Cancelada",
    color: "bg-slate-500/15 text-slate-500 border-slate-500/30",
  },
};



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

  // Confirmación de cambio de estado
  const [pendingChange, setPendingChange] = useState<{
    requestId: string;
    newStatus: RequestStatus;
  } | null>(null);
  const [updating, setUpdating] = useState(false);

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

  const handleStatusSelect = (requestId: string, newStatus: string) => {
    setPendingChange({ requestId, newStatus: newStatus as RequestStatus });
  };

  const confirmChange = async () => {
    if (!pendingChange) return;
    setUpdating(true);
    try {
      await apiClient.put(apiURLs.requestedTracks.byId(pendingChange.requestId), {
        status: pendingChange.newStatus,
      });
      setRequests((prev) =>
        prev.map((r) =>
          r.id === pendingChange.requestId
            ? { ...r, status: pendingChange.newStatus }
            : r
        )
      );

      // Si se aprueba, redirigir al home
      if (pendingChange.newStatus === RequestStatus.APROBADA) {
        router.push("/music");
      }
    } catch {
      // silencioso — el usuario puede reintentar
    } finally {
      setUpdating(false);
      setPendingChange(null);
    }
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
                  const statusCfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG[RequestStatus.PENDIENTE];
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
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      {/* Artista */}
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {requesterName}
                      </td>

                      {/* Fecha */}
                      <td className="px-6 py-4 text-sm text-primary/80 font-medium">
                        {date}
                      </td>

                      {/* Tipo de licencia */}
                      <td className="px-6 py-4 text-sm text-muted-foreground capitalize">
                        {req.licenseType?.replace(/_/g, " ") ?? "—"}
                      </td>

                      {/* Estado — Select con confirmación */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.color}`}
                        >
                          {statusCfg.label}
                        </span>
                        <select
                          value={req.status}
                          onChange={(e) => handleStatusSelect(req.id, e.target.value)}
                          className="mt-1 block w-full text-xs bg-muted border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                        >
                          {Object.values(RequestStatus).map((s) => (
                            <option key={s} value={s}>
                              {STATUS_CONFIG[s].label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Acción — link al chat */}
                      <td className="px-6 py-4">
                        {req.chat?.id ? (
                          <Link
                            href={`/music/chat?conversationId=${req.chat.id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Ver Chat
                          </Link>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sin chat</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Alert de Confirmación de Cambio de Estado */}
      {pendingChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-bold text-foreground mb-2">
              ¿Cambiar estado?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Estás a punto de cambiar el estado de esta solicitud a{" "}
              <strong className="text-foreground">
                {STATUS_CONFIG[pendingChange.newStatus].label}
              </strong>
              . Esta acción notificará al artista.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingChange(null)}
                disabled={updating}
                className="flex-1 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmChange}
                disabled={updating}
                className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
