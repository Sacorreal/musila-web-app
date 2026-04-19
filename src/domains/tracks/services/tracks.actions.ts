'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { TrackResponse } from '../types/track.types';

export async function fetchTrackById(id: string): Promise<TrackResponse> {
  const client = await getServerApiClient();
  const response = await client.get<TrackResponse>(apiURLs.tracks.byId(id));
  return response.data;
}
