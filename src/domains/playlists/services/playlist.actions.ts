'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { PlaylistDetailResponse } from '../types/playlist.types';

export async function createPlaylist(data: any) {

}

export async function fetchPlaylistByIdAction(id: string): Promise<PlaylistDetailResponse> {
  const client = await getServerApiClient();
  const response = await client.get<PlaylistDetailResponse>(apiURLs.playlists.byId(id));

  if (response.data && Array.isArray(response.data.tracks)) {
    response.data.tracks.forEach((track) => {
      if (!track.coverUrl) {
        track.coverUrl = '/cover-default.png';
      }
    });
  }

  return response.data;
}
