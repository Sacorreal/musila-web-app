import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrackRequest } from '@/src/domains/tracks/services/tracks.client';
import type { CreateTrackFormValues } from '@domains/tracks/validations/track.schema';
import { queryKeys } from '@/src/shared/constants/query-keys';
import { useUploadStorage } from '@/src/domains/storage/hooks/use-upload-storage';

export function useCreateTrack() {
  const queryClient = useQueryClient();
  
  // 1. Instanciamos nuestro Storage Hook genérico
  const { mutateAsync: uploadFiles, rollback, progresses } = useUploadStorage();

  // 2. Calculamos un "Progreso Global" promediando los archivos activos
  const progressValues = Object.values(progresses);
  const globalProgress = progressValues.length > 0 
    ? Math.round(progressValues.reduce((acc, curr) => acc + curr, 0) / progressValues.length) 
    : 0;

  const mutation = useMutation({
    mutationFn: (data: CreateTrackFormValues) => {
      // 3. Inyectamos la mutación de subida y el rollback al servicio cliente
      return createTrackRequest(data, uploadFiles, rollback);
    },
    onSuccess: () => {
      // Invalida la caché para que la lista de tracks se recargue automáticamente
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks.all });
    },
  });

  return {
    ...mutation,
    globalProgress,
    individualProgresses: progresses, // Exponemos esto por si quieres barras separadas en la UI
  };
}