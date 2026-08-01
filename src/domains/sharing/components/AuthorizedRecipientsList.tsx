"use client";

import { Loader2, ShieldCheck, X } from "lucide-react";
import { Badge } from "@/src/shared/components/UI/badge";
import { Button } from "@/src/shared/components/UI/button";
import { useAuthorizedRecipients, useRevokeRecipient } from "../hooks/sharing.hooks";

interface AuthorizedRecipientsListProps {
  shareLinkId: string;
}

export function AuthorizedRecipientsList({ shareLinkId }: AuthorizedRecipientsListProps) {
  const { data: recipients, isLoading } = useAuthorizedRecipients(shareLinkId);
  const { mutate: revoke, isPending: isRevoking, variables: revokingId } = useRevokeRecipient(shareLinkId);

  const activeRecipients = (recipients ?? []).filter((r) => !r.revokedAt);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando usuarios autorizados...
      </div>
    );
  }

  if (activeRecipients.length === 0) {
    return <p className="text-xs text-muted-foreground">Aún no has autorizado a ningún usuario.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">Usuarios autorizados ({activeRecipients.length})</p>
      <div className="flex flex-wrap gap-2">
        {activeRecipients.map((recipient) => (
          <Badge key={recipient.id} variant="secondary" className="gap-1.5 py-1.5 pl-2.5 pr-1">
            <ShieldCheck className="h-3 w-3 text-primary" />
            <span>{recipient.recipientName}</span>
            <span className="text-muted-foreground">· {recipient.recipientMusilaCreatorId}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 rounded-full hover:bg-destructive/10 hover:text-destructive"
              disabled={isRevoking && revokingId === recipient.id}
              onClick={() => revoke(recipient.id)}
              aria-label={`Revocar acceso de ${recipient.recipientName}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
