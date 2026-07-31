"use client";

import { useEffect, useState } from "react";
import { FileSignature } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { useNotificationsStore } from "@/src/domains/notifications/store/use-notifications-store";
import { TrackRequest, RequestStatus } from "@/src/domains/requests/types/request.types";
import { LicenseType } from "@/src/domains/tracks/types/track.types";
import { useLicenseContract } from "../hooks/license-contracts.hooks";
import { LicenseTermsForm } from "./LicenseTermsForm";
import { LicenseContractPreviewDialog } from "./LicenseContractPreviewDialog";
import { LicenseInstallmentsList } from "./LicenseInstallmentsList";
import { ConfirmRecordingDialog } from "./ConfirmRecordingDialog";
import { LicenseContractPaymentStatusBadge, LicenseSignatoryStatusBadge } from "./LicenseContractStatusBadges";
import {
  LicenseContractPaymentStatus,
  LicenseContractStatus,
  LicenseSignatoryStatus,
  SIGNATORY_ROLE_LABELS,
} from "../types/license-contract.types";

interface Props {
  request: TrackRequest;
  /**
   * Determinado por el llamador (mismo criterio que el resto de `requests`:
   * pertenencia a `track.authors`, no al campo `owner` de la solicitud, que
   * no siempre viaja poblado desde el backend).
   */
  isOwner: boolean;
}

export function LicenseContractSection({ request, isOwner }: Props) {
  const user = useAuthStore((s) => s.user);
  const [showForm, setShowForm] = useState(false);
  const [signingSignatoryId, setSigningSignatoryId] = useState<string | null>(null);
  const [confirmRecordingOpen, setConfirmRecordingOpen] = useState(false);

  const { data: contract, isLoading, refetch } = useLicenseContract(request.id);
  const notifications = useNotificationsStore((s) => s.notifications);

  const isRequester = !!user && request.requester?.id === user.id;
  const isSignatory = !!user && !!contract?.signatories.some((s) => s.user.id === user.id);
  const canView = isOwner || isRequester || isSignatory;

  // Los eventos de contrato llegan por el socket de notificaciones ya conectado a nivel de app;
  // cuando llega uno relacionado a esta solicitud, refrescamos el contrato en vez de abrir un socket propio.
  useEffect(() => {
    const latest = notifications[0];
    if (!latest || !latest.type?.startsWith("license.contract.")) return;
    if ((latest.data as any)?.requestedTrackId !== request.id) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications[0]?.id]);

  if (request.licenseType !== LicenseType.LICENCIA_DE_PRIMER_USO) return null;

  if (isLoading) {
    return <div className="mt-8 h-24 animate-pulse rounded-2xl bg-muted/40" />;
  }

  if (!canView) return null;

  const trackTitle = request.track?.title ?? "esta canción";
  const mySignatory = contract?.signatories.find((s) => s.user.id === user?.id) ?? null;

  return (
    <section className="mt-8 rounded-2xl border bg-card p-6 md:p-8 shadow-sm space-y-6 scroll-mt-24">
      <div className="flex items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <FileSignature className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Licencia de primer uso</h2>
            <p className="text-sm text-muted-foreground">Generación y firma electrónica del contrato en línea.</p>
          </div>
        </div>
        {contract && <LicenseContractPaymentStatusBadge status={contract.paymentStatus} />}
      </div>

      {!contract ? (
        isOwner && request.status === RequestStatus.PENDIENTE && request.track?.id ? (
          showForm ? (
            <LicenseTermsForm
              requestedTrackId={request.id}
              trackId={request.track.id}
              onGenerated={() => {
                setShowForm(false);
                refetch();
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed bg-muted/30 p-8 text-center">
              <FileSignature className="h-8 w-8 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                Genera el contrato de licencia de primer uso directamente en la plataforma, o adjunta uno elaborado
                por fuera desde el estado de la solicitud.
              </p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <FileSignature className="h-4 w-4" />
                Generar licencia en línea
              </Button>
            </div>
          )
        ) : (
          <p className="text-sm text-muted-foreground">
            El compositor aún no ha generado el contrato de licencia en línea para esta solicitud.
          </p>
        )
      ) : contract.status === LicenseContractStatus.DRAFT ? (
        isOwner && request.track?.id ? (
          <LicenseTermsForm
            requestedTrackId={request.id}
            trackId={request.track.id}
            existingContract={contract}
            onGenerated={() => refetch()}
          />
        ) : (
          <p className="text-sm text-muted-foreground">El compositor está preparando el contrato.</p>
        )
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {contract.signatories.map((signatory) => (
              <div key={signatory.id} className="flex items-center justify-between gap-4 rounded-xl border bg-muted/10 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {signatory.user.name} {signatory.user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{SIGNATORY_ROLE_LABELS[signatory.role]}</p>
                  {signatory.status === LicenseSignatoryStatus.REJECTED && signatory.rejectionReason && (
                    <p className="mt-1 text-xs text-destructive">Motivo: {signatory.rejectionReason}</p>
                  )}
                </div>
                <LicenseSignatoryStatusBadge status={signatory.status} />
              </div>
            ))}
          </div>

          {mySignatory?.status === LicenseSignatoryStatus.PENDING && (
            <Button onClick={() => setSigningSignatoryId(mySignatory.id)} className="w-full gap-2">
              <FileSignature className="h-4 w-4" />
              Revisar y firmar mi participación
            </Button>
          )}

          {contract.status === LicenseContractStatus.SIGNED &&
            contract.advanceAmount > 0 &&
            (contract.paymentStatus === LicenseContractPaymentStatus.PENDIENTE ||
              contract.paymentStatus === LicenseContractPaymentStatus.EN_MORA) && (
              <LicenseInstallmentsList
                contractId={contract.id}
                isRequester={isRequester}
                currency={contract.advanceCurrency}
              />
            )}

          {contract.status === LicenseContractStatus.EXPIRED && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-amber-400/50 bg-amber-500/5 p-6 text-center">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                La vigencia de esta licencia venció sin ISRC registrado. Si la canción ya fue grabada, confirma el
                ISRC para dar la licencia por cumplida; de lo contrario, el compositor puede cancelar la solicitud y
                ofrecerla a otro intérprete.
              </p>
              <Button variant="outline" onClick={() => setConfirmRecordingOpen(true)} className="gap-2">
                Confirmar ISRC
              </Button>
            </div>
          )}

          {contract.status === LicenseContractStatus.FULFILLED && (
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Licencia cumplida: la grabación ya cuenta con ISRC asignado.
            </p>
          )}
        </div>
      )}

      {mySignatory && signingSignatoryId && contract && (
        <LicenseContractPreviewDialog
          isOpen={!!signingSignatoryId}
          requestedTrackId={request.id}
          trackTitle={trackTitle}
          contract={contract}
          signatory={mySignatory}
          onClose={() => setSigningSignatoryId(null)}
        />
      )}

      {contract && (
        <ConfirmRecordingDialog
          isOpen={confirmRecordingOpen}
          onClose={() => setConfirmRecordingOpen(false)}
          requestedTrackId={request.id}
          contractId={contract.id}
        />
      )}
    </section>
  );
}
