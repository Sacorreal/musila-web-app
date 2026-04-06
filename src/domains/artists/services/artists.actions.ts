'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { User } from '@/src/domains/users/models/user.model';
import { UserRole } from '@/src/domains/users/types/user.types';
import { TrackSummary } from '@/src/domains/tracks/types/track.type';

export async function fetchFeaturedArtists(): Promise<User[]> {
  const client = await getServerApiClient();
  const response = await client.get<User[]>(apiURLs.users.authors, {
    params: {
      role: `${UserRole.AUTOR},${UserRole.CANTAUTOR}`,
      limit: 10
    }
  });
  return response.data;
}

export async function fetchArtistById(id: string): Promise<User> {
  const client = await getServerApiClient();
  const response = await client.get<User>(apiURLs.users.authorById(id));
  return response.data;
}

export async function fetchArtistTracks(artistId: string): Promise<TrackSummary[]> {
  // We use apiURLs.tracks.base and send authorsIds to let the backend filter the results.
  const client = await getServerApiClient();
  const response = await client.get<TrackSummary[]>(apiURLs.tracks.base, {
    params: { authorsIds: artistId }
  });
  return response.data;
}
