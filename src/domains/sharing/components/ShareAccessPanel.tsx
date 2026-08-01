"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Trash2, XCircle } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Badge } from "@/src/shared/components/UI/badge";
import {
  useMyShareLinks,
  useRevokeShareLink,
  useShareAccessLog,
} from "../hooks/sharing.hooks";
import { RecipientSearchInput } from "./RecipientSearchInput";
import { AuthorizedRecipientsList } from "./AuthorizedRecipientsList";
import { ShareResourceType } from "../types/sharing.types";

interface ShareAccessPanelProps {
  resourceType: ShareResourceType;
  resourceId: string;
}

export function ShareAccessPanel({ resourceType, resourceId }: ShareAccessPanelProps) {
  const { data: allLinks, isLoading } = useMyShareLinks();
  const links = (allLinks ?? []).filter(
    (link) => link.resourceType === resourceType && link.resourceId === resourceId && !link.revokedAt,
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando enlaces de compartir...
      </div>
    );
  }

  if (links.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">Aún no has generado un enlace para compartir esto.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {links.map((link) => (
        <ShareLinkManageCard key={link.id} shareLinkId={link.id} />
      ))}
    </div>
  );
}

function ShareLinkManageCard({ shareLinkId }: { shareLinkId: string }) {
  const [showLog, setShowLog] = useState(false);
  const revokeLink = useRevokeShareLink(shareLinkId);
  const { data: accessLog, isLoading: isLoadingLog } = useShareAccessLog(showLog ? shareLinkId : undefined);

  return (
    <div className="rounded-xl border border-border p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-mono text-muted-foreground truncate">Enlace #{shareLinkId.slice(0, 8)}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={revokeLink.isPending}
          onClick={() => revokeLink.mutate()}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Revocar enlace
        </Button>
      </div>

      <div className="flex flex-col gap-4 border-t pt-4">
        <RecipientSearchInput shareLinkId={shareLinkId} />
        <AuthorizedRecipientsList shareLinkId={shareLinkId} />
      </div>

      <div className="border-t pt-3">
        <Button type="button" variant="link" size="sm" className="px-0 h-auto" onClick={() => setShowLog((v) => !v)}>
          {showLog ? "Ocultar" : "Ver"} historial de accesos
        </Button>

        {showLog && (
          <div className="flex flex-col gap-2 mt-2">
            {isLoadingLog ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Cargando...
              </div>
            ) : !accessLog || accessLog.data.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sin intentos de acceso registrados.</p>
            ) : (
              <ul className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {accessLog.data.map((entry) => (
                  <li key={entry.id} className="flex items-center gap-2 text-xs">
                    {entry.granted ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                    )}
                    <span className="text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleString("es-CO")}
                    </span>
                    <Badge variant={entry.granted ? "secondary" : "outline"} className="text-[10px]">
                      {entry.reason}
                    </Badge>
                    {entry.accessorMusilaCreatorId && (
                      <span className="font-mono text-muted-foreground">{entry.accessorMusilaCreatorId}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
