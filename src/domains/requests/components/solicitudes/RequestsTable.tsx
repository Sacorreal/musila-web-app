import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/shared/components/UI/button";
import { UserPlanType } from "@/src/domains/users/types/user.types";
import { TrackRequest, RequestStatus } from "../../types/request.types";
import { RequestsTableRow } from "./RequestsTableRow";
import { TrackRequestDetailsDialog } from "../TrackRequestDetailsDialog";
import { ApproveRequestDialog } from "./ApproveRequestDialog";

interface Props {
  requests: TrackRequest[];
  activeTab: "enviadas" | "recibidas";
  processingId: string | null;
  userRole: any;
  userId: string | undefined;
  onApprove: (id: string) => void;
  onApproveSuccess: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
  onDownload: (track: any) => void;
  isInitialListEmpty: boolean;
}

export function RequestsTable({
  requests,
  activeTab,
  processingId,
  userRole,
  userId,
  onApprove,
  onApproveSuccess,
  onReject,
  onCancel,
  onDownload,
  isInitialListEmpty,
}: Props) {
  const [selectedRequest, setSelectedRequest] = useState<{ request: TrackRequest; isOwner: boolean } | null>(null);
  const [approveTarget, setApproveTarget] = useState<TrackRequest | null>(null);

  const handleRowClick = (req: TrackRequest, canChangeStatus: boolean) => {
    setSelectedRequest({ request: req, isOwner: canChangeStatus });
  };
  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-[2rem] border border-border overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
              <th className="px-3 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6">Canción</th>
              {activeTab === "enviadas" && <th className="px-3 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6 hidden sm:table-cell">Autor</th>}
              {activeTab === "recibidas" && <th className="px-3 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6 hidden sm:table-cell">Solicitante</th>}
              <th className="px-3 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6 hidden md:table-cell">Fecha</th>
              <th className="px-3 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6 text-center">Estado</th>
              <th className="px-3 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {requests.length === 0 ? (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={5} className="px-4 sm:px-8 py-16 sm:py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Music className="text-muted-foreground" size={32} />
                      </div>
                      <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
                        {isInitialListEmpty
                          ? activeTab === "enviadas"
                            ? "Aún no has enviado ninguna solicitud"
                            : "No has recibido solicitudes aún"
                          : "Sin resultados para este filtro"}
                      </p>
                      {isInitialListEmpty && activeTab === "enviadas" && (
                        <Button asChild variant="outline" className="mt-2 rounded-xl">
                          <Link href="/music">Explorar canciones</Link>
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ) : (
                requests.map((req, index) => {
                  const authors = (req.track as any)?.authors as any[] | undefined;
                  const canChangeStatus = userRole === UserPlanType.ADMIN || (Array.isArray(authors) && authors.some((a) => a.id === userId));
                  const canCancel = req.requester?.id === userId && req.status === RequestStatus.PENDIENTE;

                  return (
                    <RequestsTableRow
                      key={req.id}
                      request={req}
                      index={index}
                      activeTab={activeTab}
                      isProcessing={processingId === req.id}
                      canChangeStatus={canChangeStatus}
                      canCancel={canCancel}
                      onApprove={(id) => {
                        const target = requests.find((r) => r.id === id) ?? null;
                        setApproveTarget(target);
                      }}
                      onReject={onReject}
                      onCancel={onCancel}
                      onDownload={onDownload}
                      onClick={() => handleRowClick(req, canChangeStatus)}
                    />
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <TrackRequestDetailsDialog 
        request={selectedRequest?.request || null}
        isOwner={selectedRequest?.isOwner || false}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />

      <ApproveRequestDialog
        isOpen={!!approveTarget}
        request={approveTarget}
        onClose={() => setApproveTarget(null)}
        onSuccess={(id) => {
          onApproveSuccess(id);
          setApproveTarget(null);
        }}
        onGenerateOnline={() => {
          if (approveTarget) setSelectedRequest({ request: approveTarget, isOwner: true });
          setApproveTarget(null);
        }}
      />
    </div>
  );
}
