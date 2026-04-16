'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { AuthorDetailResponse } from '../types/artist.types'
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

export async function fetchArtistById(id: string): Promise<AuthorDetailResponse> {
  const client = await getServerApiClient();
  const response = await client.get<AuthorDetailResponse>(apiURLs.users.userById(id));
  return response.data;
}

