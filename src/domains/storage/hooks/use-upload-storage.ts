import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { requestPresignedUrls, uploadFileToSpaces, rollbackUploads } from '@/src/domains/storage/services/storage.client';
import type { UploadableFile, UploadedFileInfo } from '@/src/domains/storage/types/storage.types';

export function useUploadStorage() {
  // Estado para rastrear el progreso independiente de cada archivo
  const [progresses, setProgresses] = useState<Record<string, number>>({});

  const mutation = useMutation({
    mutationFn: async (files: UploadableFile[]): Promise<UploadedFileInfo[]> => {
      setProgresses({});
      
      const { urls } = await requestPresignedUrls(files);

      const uploadTasks = files.map((fileItem) => {
        const urlInfo = urls.find((u) => u.field === fileItem.field);
        
        if (!urlInfo) {
          throw new Error(`No se recibió la firma del servidor para el archivo: ${fileItem.field}`);
        }

        // Subimos y, al terminar, mapeamos el resultado a la estructura UploadedFileInfo
        return uploadFileToSpaces(urlInfo.uploadUrl, fileItem.file, (percent) => {
          setProgresses((prev) => ({ ...prev, [fileItem.field]: percent }));
        }).then(() => ({
          field: urlInfo.field,
          key: urlInfo.key,
          publicUrl: urlInfo.publicUrl
        }));
      });

      return Promise.all(uploadTasks);
    },
  });

  return {
    ...mutation,
    progresses,
    rollback: rollbackUploads, // Exponemos la función pura para casos de error
  };
}