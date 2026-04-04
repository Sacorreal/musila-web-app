'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { User } from '@/src/domains/users/models/user.model';
import { UserRole } from '@/src/domains/users/types/user.types';

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
