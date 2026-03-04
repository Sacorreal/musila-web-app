'use server'

import { getServerApiClient } from '@/src/shared/api/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';

export async function createPlaylistAction(data: any) {
  const client = await getServerApiClient();
  const response = await client.post(apiURLs.playlists.all, data);
  return response.data;
}
