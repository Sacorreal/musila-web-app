'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/src/shared/components/UI/badge';
import { Button } from '@/src/shared/components/UI/button';
import { DownloadButton } from '@/src/shared/components/UI/DownloadButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/shared/components/UI/alert-dialog';
import { apiURLs } from '@/src/shared/constants/urls';
import { useRegenerateCertificate } from '../hooks/use-certificate.hooks';
import type { CertificateStatusValue } from '../types/certificate.types';

interface CertificateCellProps {
  trackId: string;
  trackTitle: string;
  certificateStatus?: CertificateStatusValue | null;
}

/**
 * Estado/acción del Certificado de Autoría por fila de "Mis canciones".
 * `certificateStatus` viene ya incluido en `GET /tracks/me` (evita N+1);
 * `null`/`undefined` no renderiza nada — cubre tanto la ventana breve entre
 * publicar y que el listener cree el registro, como canciones publicadas
 * antes de este feature (sin back-fill, fuera de alcance).
 */
export function CertificateCell({ trackId, trackTitle, certificateStatus }: CertificateCellProps) {
  const [downloadFailed, setDownloadFailed] = useState(false);
  const { mutate: regenerate, isPending: isRegenerating } = useRegenerateCertificate();

  if (!certificateStatus) return null;

  if (certificateStatus === 'pending') {
    return (
      <motion.div animate={{ opacity: [1, 0.55, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
        <Badge
          variant="secondary"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold uppercase text-[9px] sm:text-[10px] whitespace-nowrap"
        >
          Generando certificado…
        </Badge>
      </motion.div>
    );
  }

  const needsRegeneration = certificateStatus === 'failed' || downloadFailed;

  if (needsRegeneration) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isRegenerating}
            className="h-7 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase gap-1.5 whitespace-nowrap"
          >
            <RefreshCw className={`h-3 w-3 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerar certificado
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">¿Regenerar certificado?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Vamos a generar de nuevo el Certificado de Autoría de <strong>&quot;{trackTitle}&quot;</strong>. Esto
              puede tardar unos segundos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              onClick={() => {
                setDownloadFailed(false);
                regenerate(trackId);
              }}
            >
              Regenerar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <DownloadButton
      fetchUrl={apiURLs.tracks.certificateDownload(trackId)}
      filename={`certificado-autoria-${trackId.substring(0, 8)}.pdf`}
      label="Certificado"
      loadingLabel="Generando…"
      size="sm"
      variant="outline"
      className="h-7 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase gap-1.5 whitespace-nowrap"
      onError={() => setDownloadFailed(true)}
    />
  );
}
