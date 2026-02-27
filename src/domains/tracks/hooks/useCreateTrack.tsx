import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrackRequest } from '@/src/domains/tracks/services/tracks.client';
import type { CreateTrackFormValues } from '@domains/tracks/validations/track.schema';
import {queryKeys } from '@/src/shared/constants/query-keys'

export function useCreateTrack() {
  const queryClient = useQueryClient();
  const [globalProgress, setGlobalProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (data: CreateTrackFormValues) => {
      return createTrackRequest(data, {
        onProgress: (percent) => setGlobalProgress(percent),
      });
    },
    onSuccess: () => {
      // Invalida la caché para que la lista de tracks se recargue automáticamente
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks.all });
    },
  });

  return {
    ...mutation,
    globalProgress,
  };
}