"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/UI/dialog";
import { Button } from "@/src/shared/components/UI/button";
import { useCreateShareLink } from "../hooks/sharing.hooks";
import { RecipientSearchInput } from "./RecipientSearchInput";
import { AuthorizedRecipientsList } from "./AuthorizedRecipientsList";
import { ShareResourceType } from "../types/sharing.types";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceType: ShareResourceType;
  resourceId: string;
  resourceTitle: string;
}

const RESOURCE_LABELS: Record<ShareResourceType, string> = {
  [ShareResourceType.PROFILE]: "perfil",
  [ShareResourceType.PLAYLIST]: "playlist",
  [ShareResourceType.TRACK]: "track",
};

export function ShareModal({ open, onOpenChange, resourceType, resourceId, resourceTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { mutate, data: shareLink, isPending } = useCreateShareLink(resourceType, resourceId);

  useEffect(() => {
    if (open && !shareLink) {
      mutate(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCopy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink.shareUrl);
      setCopied(true);
      toast.success("Enlace copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const resourceLabel = RESOURCE_LABELS[resourceType];
  const requiresAuthorization = resourceType !== ShareResourceType.PROFILE;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compartir {resourceLabel}</DialogTitle>
          <DialogDescription>
            {requiresAuthorization
              ? `Genera un enlace y autoriza a otros usuarios por su Musila Creator ID a escuchar "${resourceTitle}".`
              : `Comparte el enlace público de tu perfil para que otros usuarios puedan descubrirte y seguirte.`}
          </DialogDescription>
        </DialogHeader>

        {isPending && !shareLink ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generando enlace...
          </div>
        ) : shareLink ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground font-mono truncate flex items-center gap-2">
                  <Link2 className="w-4 h-4 shrink-0 text-primary" />
                  <span className="truncate">{shareLink.shareUrl}</span>
                </div>
                <Button onClick={handleCopy} className="shrink-0" variant={copied ? "secondary" : "default"}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" /> Copiar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {shareLink.viewCount} {shareLink.viewCount === 1 ? "visita" : "visitas"} registradas
              </p>
            </div>

            {requiresAuthorization && (
              <div className="flex flex-col gap-4 border-t pt-4">
                <RecipientSearchInput shareLinkId={shareLink.id} />
                <AuthorizedRecipientsList shareLinkId={shareLink.id} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-muted-foreground">No se pudo generar el enlace.</p>
            <Button variant="outline" onClick={() => mutate(undefined)}>
              Reintentar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
