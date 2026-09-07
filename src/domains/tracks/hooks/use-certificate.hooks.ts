'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { certificateClient } from '../services/certificate.client';
import type { CertificateStatusDto } from '../types/certificate.types';

export function useCertificateStatus(trackId: string, enabled = true) {
  return useQuery<CertificateStatusDto>({
    queryKey: ['certificate', trackId],
    queryFn: () => certificateClient.getStatus(trackId),
    enabled: !!trackId && enabled,
  });
}

export function useDownloadCertificate() {
  return useMutation({
    mutationFn: (trackId: string) => certificateClient.download(trackId),
    onError: (error: any) => {
      toast.error(error?.message ?? 'No se pudo descargar el certificado');
    },
  });
}

export function useRegenerateCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trackId: string) => certificateClient.regenerate(trackId),
    onSuccess: (_data, trackId) => {
      queryClient.invalidateQueries({ queryKey: ['certificate', trackId] });
      queryClient.invalidateQueries({ queryKey: ['tracks', 'me'] });
      toast.success('Estamos regenerando tu certificado de autoría');
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'No se pudo regenerar el certificado');
    },
  });
}
