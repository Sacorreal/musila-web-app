import axios from "axios";
import type { CreateTrackFormValues } from "../validations/track.schema";
import type { Track } from "../models/track.model";
import { apiURLs } from "@/src/shared/constants/urls";
import {
  requestPresignedUrls,
  uploadFileToSpaces,
  rollbackUploads, 
} from "@/src/domains/storage/services/storage.service";
import { StorageFolder,  type UploadableFile } from "@/src/domains/storage/types/storage.types";
import { CreateTrackPayload} from '@domains/tracks/types/track.type'


interface CreateTrackOptions {
  onProgress?: (percentage: number) => void;
  signal?: AbortSignal;
}



export async function createTrackRequest(
  data: CreateTrackFormValues,
  options?: CreateTrackOptions,
): Promise<Track> {
  const { onProgress, signal } = options || {};
  const { audio, coverImage, authorsIds, ...dto } = data;

  // Fail-fast validation
  if (!audio) {
    throw new Error("Audio file is required");
  }

  // ================================
  // 1️⃣ Solicitar URLs firmadas (El backend ahora genera los keys)
  // ================================
  const filesToUpload: UploadableFile[] = [
    { field: "audio", file: audio, folder: StorageFolder.TRACK_AUDIO },
    ...(coverImage
      ? [{ field: "cover" as const, file: coverImage, folder: StorageFolder.TRACK_COVER }]
      : []),
  ];

  const { urls } = await requestPresignedUrls(filesToUpload);

  const audioUploadInfo = urls.find((u) => u.field === "audio");
  const coverUploadInfo = urls.find((u) => u.field === "cover");

  if (!audioUploadInfo?.uploadUrl || !audioUploadInfo?.key) {
    throw new Error("Invalid audio signature or missing key from backend");
  }

  // ================================
  // 2️⃣ Subida en Paralelo a Storage (Digital Ocean Spaces)
  // ================================
  try {
    const uploadTasks: Promise<void>[] = [
      uploadFileToSpaces(audioUploadInfo.uploadUrl, audio, onProgress)
    ];

    if (coverImage && coverUploadInfo?.uploadUrl) {
      // La portada no suele necesitar tracking de progreso por ser ligera
      uploadTasks.push(uploadFileToSpaces(coverUploadInfo.uploadUrl, coverImage));
    }

    // Ejecutamos ambas subidas al mismo tiempo
    await Promise.all(uploadTasks);
  } catch (storageError) {
    throw new Error("Failed to upload media files to storage. Please try again.");
  }

  // ================================
  // 3️⃣ Construir el DTO
  // ================================
  const payload: CreateTrackPayload = {
    ...dto,
    authorsIds,
    audioKey: audioUploadInfo.key,             
    audioUrl: audioUploadInfo.publicUrl,
    coverKey: coverUploadInfo?.key ?? undefined,    
    coverUrl: coverUploadInfo?.publicUrl ?? undefined,
  };

  // ================================
  // 4️⃣ Guardar metadatos en el backend
  // ================================
  try {
    const response = await axios.post<Track>(
      apiURLs.tracks.all,
      payload,
      {
        signal
      },
    );

    return response.data;
  } catch (apiError) {
    // 🚨 Rollback (Compensación): Si el backend falla, intentamos borrar los archivos subidos
    const keysToDelete = [audioUploadInfo.key];
    if (coverUploadInfo?.key) keysToDelete.push(coverUploadInfo.key);
    
    // Disparamos el rollback en background sin bloquear el error (fire-and-forget)
    rollbackUploads(keysToDelete).catch(console.error);

    throw new Error("Track metadata creation failed. Uploaded files were rolled back.");
  }
}