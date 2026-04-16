import {apiClient } from '@shared/libs/axios/axios-client'
import type { CreateTrackFormValues } from "../validations/track.schema";
import { apiURLs } from "@/src/shared/constants/urls";
import { StorageFolder, type UploadableFileDto } from "@/src/domains/storage/types/storage.types";
import type { CreateTrackInput, TrackResponse, TrackDetailResponse } from "@/src/domains/tracks/types/track.types";
import type { UploadedFileDto } from "@domains/storage/types/storage.types";
import { handleApiError} from '@shared/libs/handle-api-error'
import { TracksResponse} from '../types/track.types'


interface CreateTrackOptions {
  signal?: AbortSignal;
}



export async function createTrackRequest(
  data: CreateTrackFormValues,
  // Recibimos las funciones inyectadas desde el Hook
  uploadFilesFn: (files: UploadableFileDto[]) => Promise<UploadedFileDto[]>,
  rollbackFn: (keys: string[]) => Promise<void>,
  options?: CreateTrackOptions,
): Promise<TrackResponse> {
  const { signal } = options || {};
  const { audio, coverImage, authorsIds, ...dto } = data;

  if (!audio) throw new Error("Audio file is required");

  const filesToUpload: UploadableFileDto[] = [
    { field: "audio", file: audio, folder: StorageFolder.TRACK_AUDIO },
    ...(coverImage ? [{ field: "cover", file: coverImage, folder: StorageFolder.TRACK_COVER } as UploadableFileDto] : []),
  ];

  let uploadedFiles: UploadedFileDto[] = [];

  // ========================================================
  // 1️⃣ y 2️⃣: Firmas y Subida delegada al Hook inyectado
  // ========================================================
  try {
    uploadedFiles = await uploadFilesFn(filesToUpload);
  } catch (storageError) {
    throw new Error("Failed to upload media files to storage. Please try again.");
  }

  // Buscamos los resultados por el nombre del 'field'
  const audioInfo = uploadedFiles.find((f) => f.field === "audio");
  const coverInfo = uploadedFiles.find((f) => f.field === "cover");

  if (!audioInfo) throw new Error("Error en la verificación del audio subido.");

  // ========================================================
  // 3️⃣ Construir el Payload
  // ========================================================
  const payload: CreateTrackInput = {
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
    const response = await apiClient.post<TrackResponse>(apiURLs.tracks.base, payload, {
      signal,
    });
    return response.data;
  } catch (apiError) {
    // 🚨 Compensación: Usamos la función inyectada para limpiar
    const keysToDelete = [audioInfo.key];
    if (coverInfo?.key) keysToDelete.push(coverInfo.key);

    rollbackFn(keysToDelete).catch(console.error);

    throw new Error("Failed to create track metadata. Uploads have been rolled back.");
  }
}

export const tracksService = {
  // ✅ Obtener todas las canciones
  async getAll(): Promise<TracksResponse> {
    try {
      const { data } = await apiClient.get<TracksResponse>(
        apiURLs.tracks.base
      );
      return data
    } catch (error) {
      handleApiError(error, "Error al obtener las canciones");
    }
  },

  // ✅ Obtener canciones del usuario
  async getMyTracks(): Promise<TrackResponse[]> {
    try {
      const { data } = await apiClient.get<TrackResponse[]>(
        `${apiURLs.tracks.base}/me`
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al obtener tus canciones");
    }
  },

  // ✅ Buscar canciones
  async search(query: string): Promise<TracksResponse> {
    try {
      const { data } = await apiClient.get<TracksResponse>(
        apiURLs.tracks.base,
        { params: { q: query } }
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al buscar canciones");
    }
  },


  // ✅ Featured (con fallback inteligente)
  async getFeaturedTracks(): Promise<TrackResponse[]> {
    try {
      const { data } = await apiClient.get<TrackResponse[]>(
        apiURLs.tracks.base,
        { params: { limit: 20 } }
      );

      return Array.isArray(data) ? data : [];
    } catch (errorWithLimit) {
      console.warn(
        "[FeaturedTracks] fallback sin params",
        errorWithLimit
      );

      try {
        const { data } = await apiClient.get<TrackResponse[]>(
          apiURLs.tracks.base
        );
        return Array.isArray(data) ? data : [];
      } catch (error) {
        handleApiError(error, "Error al obtener canciones destacadas");
      }
    }
  },

  // ✅ Detalle de canción
  async getById(id: string): Promise<TrackDetailResponse> {
    try {
      const { data } = await apiClient.get<TrackDetailResponse>(
        apiURLs.tracks.byId(id)
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al obtener la canción");
    }
  },
};


