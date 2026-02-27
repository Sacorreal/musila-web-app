import axios from "axios";
import type { CreateTrackFormValues } from "../validations/track.schema";
import { apiURLs } from "@/src/shared/constants/urls";
import { StorageFolder, type UploadableFile } from "@/src/domains/storage/types/storage.types";
import type { CreateTrackPayload, TrackSummary } from '@domains/tracks/types/track.type';
import type { UploadedFileInfo } from '@domains/storage/types/storage.types';

interface CreateTrackOptions {
  signal?: AbortSignal;
}

export async function createTrackRequest(
  data: CreateTrackFormValues,
  // Recibimos las funciones inyectadas desde el Hook
  uploadFilesFn: (files: UploadableFile[]) => Promise<UploadedFileInfo[]>,
  rollbackFn: (keys: string[]) => Promise<void>,
  options?: CreateTrackOptions,
): Promise<TrackSummary> {
  const { signal } = options || {};
  const { audio, coverImage, authorsIds, ...dto } = data;

  if (!audio) throw new Error("Audio file is required");

  const filesToUpload: UploadableFile[] = [
    { field: "audio", file: audio, folder: StorageFolder.TRACK_AUDIO },
    ...(coverImage ? [{ field: "cover", file: coverImage, folder: StorageFolder.TRACK_COVER } as UploadableFile] : []),
  ];

  let uploadedFiles: UploadedFileInfo[] = [];

  // ========================================================
  // 1️⃣ y 2️⃣: Firmas y Subida delegada al Hook inyectado
  // ========================================================
  try {
    uploadedFiles = await uploadFilesFn(filesToUpload);
  } catch (storageError) {
    throw new Error("Failed to upload media files to storage. Please try again.");
  }

  // Buscamos los resultados por el nombre del 'field'
  const audioInfo = uploadedFiles.find(f => f.field === 'audio');
  const coverInfo = uploadedFiles.find(f => f.field === 'cover');

  if (!audioInfo) throw new Error("Error en la verificación del audio subido.");

  // ========================================================
  // 3️⃣ Construir el Payload
  // ========================================================
  const payload: CreateTrackPayload = {
    ...dto,
    authorsIds,
    audioKey: audioInfo.key,             
    audioUrl: audioInfo.publicUrl,
    coverKey: coverInfo?.key ?? undefined,    
    coverUrl: coverInfo?.publicUrl ?? undefined,
  };

  // ========================================================
  // 4️⃣ Guardar metadatos (Con Rollback inyectado)
  // ========================================================
  try {
    const response = await axios.post<TrackSummary>(
      apiURLs.tracks.all,
      payload,
      { signal },
    );
    return response.data;
  } catch (apiError) {
    // 🚨 Compensación: Usamos la función inyectada para limpiar
    const keysToDelete = [audioInfo.key];
    if (coverInfo?.key) keysToDelete.push(coverInfo.key);
    
    rollbackFn(keysToDelete).catch(console.error);
    
    throw new Error("Failed to create track metadata. Uploads have been rolled back.");
  }
}