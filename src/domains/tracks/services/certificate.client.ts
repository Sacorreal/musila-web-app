import { apiClient } from '@shared/libs/axios/axios-client';
import { apiURLs } from '@/src/shared/constants/urls';
import { handleApiError } from '@shared/libs/handle-api-error';
import type { CertificateStatusDto } from '../types/certificate.types';

/**
 * Descarga el PDF vía el proxy autenticado de Next.js (mismo patrón que
 * `downloadReceipt` en `PaymentsTab`): el proxy adjunta la cookie httpOnly
 * y devuelve el binario con `Content-Disposition` ya resuelto.
 */
async function download(trackId: string): Promise<void> {
  const res = await fetch(apiURLs.tracks.certificateDownload(trackId));

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? 'No se pudo descargar el certificado');
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificado-autoria-${trackId.substring(0, 8)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const certificateClient = {
  async getStatus(trackId: string): Promise<CertificateStatusDto> {
    try {
      const { data } = await apiClient.get<CertificateStatusDto>(apiURLs.tracks.certificate(trackId));
      return data;
    } catch (error) {
      handleApiError(error, 'Error al consultar el estado del certificado');
    }
  },

  download,

  async regenerate(trackId: string): Promise<CertificateStatusDto> {
    try {
      const { data } = await apiClient.post<CertificateStatusDto>(apiURLs.tracks.certificateRegenerate(trackId));
      return data;
    } catch (error) {
      handleApiError(error, 'Error al regenerar el certificado');
    }
  },
};
