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
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LegalIdentityRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

export function LegalIdentityRequiredModal({ open, onClose }: LegalIdentityRequiredModalProps) {
  const pathname = usePathname();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" aria-describedby="legal-identity-required-description">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldAlert className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center">Identidad legal requerida</DialogTitle>
          <DialogDescription id="legal-identity-required-description" className="text-center">
            Por ley (Ley 527 de Colombia), necesitas verificar tu identidad legal antes de firmar
            splits o reproducir canciones de otros autores. Solo toma un minuto.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full" onClick={onClose}>
            <Link href={`/music/perfil?redirect=${encodeURIComponent(pathname ?? '/music/perfil')}`}>
              Completar identidad legal
            </Link>
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
