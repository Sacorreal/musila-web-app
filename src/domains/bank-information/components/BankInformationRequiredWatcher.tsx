"use client";

import { useEffect } from "react";
import { useNotificationsStore } from "@/src/domains/notifications/store/use-notifications-store";
import { useBankInformationPendingStatus } from "../hooks/bank-information.hooks";
import { BankInformationDialog } from "./BankInformationDialog";

/**
 * Watcher global (montado en el layout de /music, junto a
 * LegalIdentityRequiredWatcher/UsernameRequiredWatcher): verifica contra el
 * backend si el usuario tiene un registro de información bancaria pendiente
 * y, de ser así, muestra el diálogo bloqueante hasta que lo complete. El
 * estado real vive en BD (no sessionStorage) para que reaparezca en cada
 * sesión mientras siga pendiente (Flow 4).
 */
export function BankInformationRequiredWatcher() {
  const { data, refetch } = useBankInformationPendingStatus();
  const notifications = useNotificationsStore((s) => s.notifications);

  // Los eventos llegan por el socket de notificaciones ya conectado a nivel
  // de app; cuando llega uno de "solicitud de información bancaria", se
  // refresca el estado pendiente para abrir el diálogo sin esperar recarga.
  useEffect(() => {
    const latest = notifications[0];
    if (!latest || latest.type !== "wallet.bank_information.requested") return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications[0]?.id]);

  return (
    <BankInformationDialog
      open={!!data?.pending}
      request={data?.request}
      onCompleted={() => refetch()}
    />
  );
}
