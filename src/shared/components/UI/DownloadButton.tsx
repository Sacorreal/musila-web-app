'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Download, Loader2 } from 'lucide-react';
import { Button, buttonVariants } from './button';
import type { VariantProps } from 'class-variance-authority';

interface DownloadButtonProps extends VariantProps<typeof buttonVariants> {
  /** Ruta del proxy Next.js autenticado que sirve el binario (`fetch` + `blob`). */
  fetchUrl: string;
  filename: string;
  label?: string;
  loadingLabel?: string;
  className?: string;
  disabled?: boolean;
  /** Si se provee, reemplaza el `toast.error` por defecto — útil para ofrecer "regenerar" en vez de un simple error. */
  onError?: (error: Error) => void;
}

/**
 * Botón de descarga de archivos binarios servidos por un proxy Next.js
 * autenticado (cookie httpOnly). Encapsula el patrón fetch → blob →
 * `<a download>` → revoke usado originalmente en `PaymentsTab.downloadReceipt`,
 * reutilizado aquí para el Certificado de Autoría.
 */
export function DownloadButton({
  fetchUrl,
  filename,
  label = 'Descargar',
  loadingLabel = 'Generando PDF...',
  variant,
  size,
  className,
  disabled,
  onError,
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch(fetchUrl);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? 'No se pudo descargar el archivo');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('No se pudo descargar el archivo');
      if (onError) onError(err);
      else toast.error(err.message);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || downloading}
      onClick={handleDownload}
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel && <span>{loadingLabel}</span>}
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {label && <span>{label}</span>}
        </>
      )}
    </Button>
  );
}
