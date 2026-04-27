import React from "react";
import { motion } from "framer-motion";
import { 
  Music, 
  User2, 
  MessageSquare, 
  Download, 
  Check, 
  X, 
  XCircle, 
  Loader2, 
  ChevronRight 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/shared/components/UI/button";
import { RequestStatus, TrackRequest } from "../../types/request.types";
import { StatusBadge } from "./StatusBadge";

interface Props {
  request: TrackRequest;
  index: number;
  activeTab: "enviadas" | "recibidas";
  isProcessing: boolean;
  canChangeStatus: boolean;
  canCancel: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
  onDownload: (track: any) => void;
}

export function RequestsTableRow({
  request,
  index,
  activeTab,
  isProcessing,
  canChangeStatus,
  canCancel,
  onApprove,
  onReject,
  onCancel,
  onDownload,
}: Props) {
  const authorsArr = (request.track as any)?.authors as any[] | undefined;
  const authorName = Array.isArray(authorsArr) && authorsArr.length > 0
    ? authorsArr.map((a) => `${a.name ?? ""} ${a.lastName ?? ""}`.trim()).join(", ")
    : "—";

  const requesterName = request.requester
    ? `${request.requester.name} ${request.requester.lastName}`.trim()
    : "—";

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group hover:bg-muted/30 transition-all duration-300"
    >
      {/* Canción */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-muted overflow-hidden shrink-0 border border-border shadow-sm">
            {request.track?.coverUrl ? (
              <img src={request.track.coverUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music size={16} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {request.track?.title || "Track desconocido"}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground opacity-60">
              {request.licenseType?.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </td>

      {/* Autor */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User2 size={13} className="shrink-0 opacity-60" />
          <span className="font-semibold truncate max-w-[130px]">{authorName}</span>
        </div>
      </td>

      {/* Solicitante */}
      {activeTab === "recibidas" && (
        <td className="px-8 py-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User2 size={13} className="shrink-0 opacity-60 text-primary" />
            <span className="font-semibold truncate max-w-[130px]">{requesterName}</span>
          </div>
        </td>
      )}

      {/* Fecha */}
      <td className="px-8 py-5">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          {new Date(request.createdAt).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </td>

      {/* Estado */}
      <td className="px-8 py-5">
        <div className="flex justify-center">
          <StatusBadge status={request.status} />
        </div>
      </td>

      {/* Acciones */}
      <td className="px-8 py-5">
        <div className="flex items-center justify-end gap-2 flex-wrap">
          {request.chat?.id && (
            <Button asChild size="sm" variant="ghost" className="rounded-xl h-9 hover:bg-primary/10 hover:text-primary gap-1.5">
              <Link href={`/music/chat?conversationId=${request.chat.id}`}>
                <MessageSquare size={16} />
                <span className="hidden sm:inline text-xs">Chat</span>
              </Link>
            </Button>
          )}

          {activeTab === "enviadas" && request.status === RequestStatus.APROBADA && (
            <Button size="sm" className="rounded-xl h-9 bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5 shadow-md shadow-emerald-500/20" onClick={() => onDownload(request.track)}>
              <Download size={16} />
              <span className="hidden sm:inline text-xs">Descargar</span>
            </Button>
          )}

          {activeTab === "recibidas" && canChangeStatus && request.status === RequestStatus.PENDIENTE && (
            <>
              <Button size="sm" className="rounded-xl h-9 bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5 shadow-md shadow-emerald-500/20" onClick={() => onApprove(request.id)} disabled={isProcessing}>
                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                <span className="hidden sm:inline text-xs">Aprobar</span>
              </Button>
              <Button size="sm" variant="ghost" className="rounded-xl h-9 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 gap-1.5" onClick={() => onReject(request.id)} disabled={isProcessing}>
                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                <span className="hidden sm:inline text-xs">Rechazar</span>
              </Button>
            </>
          )}

          {canCancel && (
            <Button size="sm" variant="ghost" className="rounded-xl h-9 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 gap-1.5" onClick={() => onCancel(request.id)} disabled={isProcessing}>
              {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              <span className="hidden sm:inline text-xs">Cancelar</span>
            </Button>
          )}

          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
        </div>
      </td>
    </motion.tr>
  );
}
