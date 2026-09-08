'use server';

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { CreateTrackNoteInput, TrackNoteDto, UpdateTrackNoteInput } from './track-notes.types';

/**
 * Sin `playlistId`, el backend devuelve solo las notas privadas del usuario
 * autenticado para ese track; con `playlistId`, devuelve todas las notas de
 * la playlist para ese track (de cualquier autor).
 */
export async function getTrackNotesAction(
  trackId: string,
  playlistId?: string,
): Promise<TrackNoteDto[]> {
  const client = await getServerApiClient();
  const response = await client.get<TrackNoteDto[]>(apiURLs.trackNotes.base, {
    params: { trackId, playlistId },
  });
  return response.data;
}

export async function createTrackNoteAction(input: CreateTrackNoteInput): Promise<TrackNoteDto> {
  const client = await getServerApiClient();
  const response = await client.post<TrackNoteDto>(apiURLs.trackNotes.base, input);
  return response.data;
}

export async function updateTrackNoteAction(
  id: string,
  input: UpdateTrackNoteInput,
): Promise<TrackNoteDto> {
  const client = await getServerApiClient();
  const response = await client.patch<TrackNoteDto>(apiURLs.trackNotes.byId(id), input);
  return response.data;
}

export async function deleteTrackNoteAction(id: string): Promise<void> {
  const client = await getServerApiClient();
  await client.delete(apiURLs.trackNotes.byId(id));
}
