"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { UserRole } from "@/src/domains/users/types/user.types";
import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { RequestStatus, TrackRequest } from "@/src/domains/requests/types/request.types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Componentes refactorizados
import { RequestsTabs, TabKey } from "@/src/domains/requests/components/solicitudes/RequestsTabs";
import { RequestsFilters } from "@/src/domains/requests/components/solicitudes/RequestsFilters";
import { RequestsTable } from "@/src/domains/requests/components/solicitudes/RequestsTable";

// Helpers de permisos
function getAvailableTabs(role: UserRole | undefined): TabKey[] {
  if (role === UserRole.ADMIN) return ["enviadas", "recibidas"];
  if (role === UserRole.CANTAUTOR) return ["enviadas", "recibidas"];
  if (role === UserRole.AUTOR) return ["recibidas"];
  return ["enviadas"];
}

export default function RequestsPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role as UserRole | undefined;

  const availableTabs = getAvailableTabs(role);
  const [activeTab, setActiveTab] = useState<TabKey>(availableTabs[0]);

  const [requests, setRequests] = useState<TrackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get<{ data: TrackRequest[]; total: number }>(
        apiURLs.requestedTracks.base
      );
      setRequests(data.data || []);
    } catch {
      toast.error("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  // Partición de solicitudes por tab
  const sent = useMemo(
    () => requests.filter((r) => r.requester?.id === user?.id),
    [requests, user]
  );

  const received = useMemo(() => {
    if (role === UserRole.ADMIN) return requests.filter((r) => r.requester?.id !== user?.id);
    return requests.filter((r) => {
      const authors = (r.track as any)?.authors as any[] | undefined;
      return Array.isArray(authors) && authors.some((a) => a.id === user?.id);
    });
  }, [requests, user, role]);

  const sourceList = activeTab === "enviadas" ? sent : received;

  // Filtrado reactivo
  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sourceList.filter((req) => {
      const matchesStatus = statusFilter === "all" || req.status === statusFilter;
      if (!q) return matchesStatus;

      const title = req.track?.title?.toLowerCase() ?? "";
      const authorsArr = (req.track as any)?.authors as any[] | undefined;
      const authorStr = Array.isArray(authorsArr)
        ? authorsArr.map((a) => `${a.name ?? ""} ${a.lastName ?? ""}`.trim()).join(" ").toLowerCase()
        : "";
      const requesterStr = `${req.requester?.name ?? ""} ${req.requester?.lastName ?? ""}`.toLowerCase();

      return matchesStatus && (title.includes(q) || authorStr.includes(q) || requesterStr.includes(q));
    });
  }, [sourceList, searchQuery, statusFilter]);

  // Acciones
  const updateStatus = async (id: string, newStatus: RequestStatus) => {
    setProcessingId(id);
    try {
      await apiClient.put(apiURLs.requestedTracks.byId(id), { status: newStatus });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      toast.success(
        newStatus === RequestStatus.CANCELADA
          ? "Solicitud cancelada"
          : newStatus === RequestStatus.APROBADA
          ? "Solicitud aprobada"
          : "Solicitud rechazada"
      );
    } catch {
      toast.error("No se pudo actualizar el estado");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6 md:p-10 space-y-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">
          Solicitudes
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestiona y haz seguimiento a las solicitudes de uso de canciones.
        </p>
      </header>

      <RequestsTabs
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSearchQuery("");
          setStatusFilter("all");
        }}
        availableTabs={availableTabs}
        sentCount={sent.length}
        receivedCount={received.length}
      />

      <RequestsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        resultsCount={filteredRequests.length}
        placeholder={activeTab === "enviadas" ? "Buscar por canción o autor..." : "Buscar por canción o solicitante..."}
      />

      <RequestsTable
        requests={filteredRequests}
        activeTab={activeTab}
        processingId={processingId}
        userRole={role}
        userId={user?.id}
        isInitialListEmpty={sourceList.length === 0}
        onApprove={(id) => handleApprove(id, updateStatus)}
        onReject={(id) => handleReject(id, updateStatus)}
        onCancel={(id) => handleCancel(id, updateStatus)}
        onDownload={(track) => handleDownload(track)}
      />
    </main>
  );
}

// Handlers auxiliares para limpiar el componente principal
const handleCancel = (id: string, updateFn: any) => {
  if (confirm("¿Cancelar esta solicitud?")) updateFn(id, RequestStatus.CANCELADA);
};
const handleApprove = (id: string, updateFn: any) => {
  if (confirm("¿Aprobar esta solicitud? El solicitante podrá descargar el track.")) updateFn(id, RequestStatus.APROBADA);
};
const handleReject = (id: string, updateFn: any) => {
  if (confirm("¿Rechazar esta solicitud?")) updateFn(id, RequestStatus.RECHAZADA);
};
const handleDownload = (track: any) => {
  if (!track?.audioUrl) return toast.error("El audio no está disponible");
  window.open(track.audioUrl, "_blank");
};