import {apiClient } from '@shared/libs/axios/axios-client'
import type {
  UploadableFile,
  PresignedUrlResponse,
  // PresignedUrlRequest ya no lo necesitaremos con esta estructura
} from "../types/storage.types"

import { apiURLs } from "@/src/shared/constants/urls"

export async function requestPresignedUrls(
  files: UploadableFile[],
): Promise<PresignedUrlResponse> {
  
  // 1. Mapeamos cada archivo a una Promesa (una petición HTTP independiente)
  const uploadRequests = files.map(async (f) => {
    // Enviamos EXACTAMENTE lo que pide el DTO de NestJS: { folder, fileType }
    const { data } = await apiClient.post(
      apiURLs.storage.presignedUrls, 
      {
        folder: f.folder,
        fileType: f.file.type,
      }
    );

    // 2. Inyectamos el 'field' a la respuesta del backend para no perder la referencia
    return {
      field: f.field,
      ...data,
    };
  });

  // 3. Ejecutamos todas las peticiones a NestJS al mismo tiempo (En paralelo)
  const urls = await Promise.all(uploadRequests);

  // Retornamos el formato { urls: [...] } que espera tu createTrackRequest
  return { urls };
}


export async function uploadFileToSpaces(
  uploadUrl: string,
  file: File,
  onProgress?: (n: number) => void,
) {
  await apiClient.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type      
    },
    withCredentials:false,
    onUploadProgress: (event) => {
      if (!event.total) return
      const percent = Math.round(
        (event.loaded * 100) / event.total,
      )
      onProgress?.(percent)
    },
  })
}

export async function rollbackUploads(keys: string[]): Promise<void> {
  // Si no hay llaves para borrar, salimos temprano
  if (!keys || keys.length === 0) return;

  try {
    console.warn("Iniciando rollback de archivos huérfanos:", keys);
    
    await apiClient.post(
      apiURLs.storage.deleteBatch, // Apunta a tu nuevo endpoint de NestJS
      { keys },
      { withCredentials: false } // Importante si tu API usa cookies/sesiones
    );

    console.log("Rollback completado exitosamente.");
  } catch (error) {
    // Aquí solo hacemos un log del error. Al ser una función "fire-and-forget",
    // no queremos lanzar (throw) el error de nuevo para no interrumpir la alerta 
    // principal que se le está mostrando al usuario en la UI.
    console.error("Fallo crítico: No se pudieron limpiar los archivos huérfanos de Spaces.", error);
    
    // Opcional: Podrías enviar este error a un sistema de monitoreo como Sentry
  }
}