"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Pencil } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { useNotificationsStore } from "@/src/domains/notifications/store/use-notifications-store";
import { TrackResponse } from "@/src/domains/tracks/types/track.types";
import { useSplitByTrack } from "../hooks/splits.hooks";
import { COAUTHOR_ROLE_LABELS, SplitAuthorDto, SplitAuthorStatus, SplitStatus } from "../types/splits.types";
import { SplitForm } from "./SplitForm";
import { SplitApprovalDialog } from "./SplitApprovalDialog";
import { SplitStatusBadge, SplitAuthorStatusBadge } from "./SplitStatusBadge";

interface Props {
  track: TrackResponse;
}

export function TrackSplitsSection({ track }: Props) {
  const user = useAuthStore((s) => s.user);
  const [showForm, setShowForm] = useState(false);
  const [approvalAuthor, setApprovalAuthor] = useState<SplitAuthorDto | null>(null);

  const { data: split, isLoading, refetch } = useSplitByTrack(track.id);

  const isTrackAuthor = !!user && track.authors?.some((a) => a.id === user.id);
  const notifications = useNotificationsStore((s) => s.notifications);

  // Los eventos de split llegan por el socket de notificaciones ya conectado a nivel de app;
  // cuando llega uno relacionado a este track, refrescamos el split en vez de abrir un socket propio.
  useEffect(() => {
    const latest = notifications[0];
    if (!latest || !latest.type?.startsWith("split.")) return;
    if ((latest.data as any)?.trackId !== track.id) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications[0]?.id]);

  if (!isTrackAuthor) return null;

  const myAuthorEntry = split?.authors.find((a) => a.user.id === user?.id);

  return (
    <section id="split" className="mt-8 rounded-2xl border bg-card p-6 md:p-8 shadow-sm space-y-6 scroll-mt-24">
      <div className="flex items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Users className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Split de coautoría</h2>
            <p className="text-sm text-muted-foreground">
              Distribución de autoría y firma digital de cada coautor.
            </p>
          </div>
        </div>
        {split && <SplitStatusBadge status={split.status} />}
      </div>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-xl bg-muted/40" />
      ) : !split ? (
        showForm ? (
          <SplitForm trackId={track.id} onDone={() => setShowForm(false)} />
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed bg-muted/30 p-8 text-center">
            <Users className="h-8 w-8 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              Este track aún no tiene un split de coautoría registrado.
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Split
            </Button>
          </div>
        )
      ) : split.status === SplitStatus.BLOCKED && showForm ? (
        <SplitForm trackId={track.id} existingSplit={split} onDone={() => setShowForm(false)} />
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {split.authors.map((author) => (
              <div key={author.id} className="flex items-center justify-between gap-4 rounded-xl border bg-muted/10 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {author.user.name} {author.user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{COAUTHOR_ROLE_LABELS[author.role]}</p>
                  {author.status === SplitAuthorStatus.REJECTED && author.rejectionReason && (
                    <p className="mt-1 text-xs text-destructive">Motivo: {author.rejectionReason}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-black text-foreground">{Number(author.percentage)}%</span>
                  <SplitAuthorStatusBadge status={author.status} />
                </div>
              </div>
            ))}
          </div>

          {myAuthorEntry?.status === SplitAuthorStatus.PENDING && (
            <Button onClick={() => setApprovalAuthor(myAuthorEntry)} className="w-full gap-2">
              Revisar y firmar mi participación
            </Button>
          )}

          {split.status === SplitStatus.BLOCKED && split.createdBy.id === user?.id && (
            <Button variant="outline" onClick={() => setShowForm(true)} className="w-full gap-2">
              <Pencil className="h-4 w-4" />
              Editar y corregir Split
            </Button>
          )}
        </div>
      )}

      {approvalAuthor && (
        <SplitApprovalDialog
          isOpen={!!approvalAuthor}
          trackId={track.id}
          splitId={split!.id}
          splitAuthor={approvalAuthor}
          onClose={() => setApprovalAuthor(null)}
        />
      )}
    </section>
  );
}
