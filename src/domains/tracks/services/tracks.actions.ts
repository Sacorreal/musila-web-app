'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { TrackSummary } from '@/src/domains/tracks/types/track.type';

/**
 * Obtiene el detalle completo de una canción por su ID.
 * Incluye autores como objetos completos y el campo lyric.
 * Usado únicamente en el Server Component de la vista de detalle.
 */
export async function fetchTrackById(id: string): Promise<TrackSummary> {
  const client = await getServerApiClient();
  const response = await client.get<TrackSummary>(apiURLs.tracks.byId(id));
  return response.data;
}

