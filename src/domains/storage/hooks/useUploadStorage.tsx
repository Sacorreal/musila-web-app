import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { requestPresignedUrls, uploadFileToSpaces, rollbackUploads } from '@domains/storage/services/storage.service';
import type { UploadableFile } from '@domains/storage/types/storage.types';

export function useUploadStorage() {
  // Estado para rastrear el progreso de cada archivo por su 'field' (ej: { audio: 45, cover: 100 })
  const [progresses, setProgresses] = useState<Record<string, number>>({});

  const mutation = useMutation({
    mutationFn: async (files: UploadableFile[]) => {
      // 1. Reiniciamos los progresos al iniciar una nueva subida
      setProgresses({});

      // 2. Pedimos las firmas al backend
      const { urls } = await requestPresignedUrls(files);

      // 3. Preparamos las tareas de subida en paralelo
      const uploadTasks = files.map((fileItem) => {
        const urlInfo = urls.find((u) => u.field === fileItem.field);
        
        if (!urlInfo) {
          throw new Error(`No se recibió la firma del servidor para el archivo: ${fileItem.field}`);
        }

        // Subimos el archivo y actualizamos el progreso específico de este 'field'
        return uploadFileToSpaces(urlInfo.uploadUrl, fileItem.file, (percent) => {
          setProgresses((prev) => ({ ...prev, [fileItem.field]: percent }));
        });
      });

      // 4. Ejecutamos todas las subidas al mismo tiempo
      await Promise.all(uploadTasks);

      // 5. Retornamos las URLs generadas para que el consumidor pueda guardarlas en la base de datos
      return urls;
    },
  });

  return {
    ...mutation,
    progresses,
    rollback: rollbackUploads, 
  };
}