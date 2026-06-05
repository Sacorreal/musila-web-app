'use client';

import { Button } from '@/src/shared/components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

const RESOURCE_LABELS: Record<string, string> = {
  tracks: 'canciones publicadas',
  requests: 'solicitudes de licencia',
  playlists: 'playlists',
  collaborators: 'colaboradores',
};

interface PremiumUpgradeModalProps {
  open: boolean;
  onClose: () => void;
  resource?: string;
  limit?: number;
}

export function PremiumUpgradeModal({
  open,
  onClose,
  resource,
  limit,
}: PremiumUpgradeModalProps) {
  const resourceLabel = resource ? RESOURCE_LABELS[resource] ?? resource : 'recursos';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" aria-describedby="premium-upgrade-description">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center">Límite de plan alcanzado</DialogTitle>
          <DialogDescription id="premium-upgrade-description" className="text-center">
            {limit !== undefined
              ? `Tu plan actual permite hasta ${limit} ${resourceLabel}.`
              : `Has alcanzado el límite de ${resourceLabel} en tu plan actual.`}
            {' '}Actualiza a Pro para continuar sin restricciones.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full" onClick={onClose}>
            <Link href="/#pricing">Ver planes Pro</Link>
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
