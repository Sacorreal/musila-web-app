'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { AuthorResponse } from '../types/artist.types'
import { AuthorsResponse } from '../types/artist.types'

export async function fetchFeaturedArtists(): Promise<AuthorsResponse> {
  const client = await getServerApiClient();
  const response = await client.get<AuthorsResponse>(apiURLs.users.authors, {
    params: {
      limit: 10
    }
  });
  return response.data;
}

export async function fetchArtistById(id: string): Promise<AuthorResponse> {
  const client = await getServerApiClient();
  const response = await client.get<AuthorResponse>(apiURLs.users.userById(id));
  return response.data;
}

