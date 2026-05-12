'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { AddCollaboratorInput, PlaylistCollaboratorResponse } from '../types/playlist-collaborator.types';

export async function getPlaylistCollaboratorsAction(playlistId: string): Promise<PlaylistCollaboratorResponse[]> {
  const client = await getServerApiClient();
  const response = await client.get<PlaylistCollaboratorResponse[]>(
    `${apiURLs.playlists.base}/${playlistId}/collaborators`
  );
  return response.data;
}

export async function addPlaylistCollaboratorAction(
  playlistId: string, 
  data: AddCollaboratorInput
): Promise<PlaylistCollaboratorResponse> {
  const client = await getServerApiClient();
  const response = await client.post<PlaylistCollaboratorResponse>(
    `${apiURLs.playlists.base}/${playlistId}/collaborators`,
    data
  );
  return response.data;
}

export async function addMultiplePlaylistCollaboratorsAction(
  playlistId: string, 
  data: import('../types/playlist-collaborator.types').AddMultipleCollaboratorsInput
): Promise<PlaylistCollaboratorResponse[]> {
  const client = await getServerApiClient();
  const response = await client.post<PlaylistCollaboratorResponse[]>(
    `${apiURLs.playlists.base}/${playlistId}/collaborators/bulk`,
    data
  );
  return response.data;
}

export async function removePlaylistCollaboratorAction(
  playlistId: string, 
  guestId: string
): Promise<void> {
  const client = await getServerApiClient();
  await client.delete(
    `${apiURLs.playlists.base}/${playlistId}/collaborators/${guestId}`
  );
}
