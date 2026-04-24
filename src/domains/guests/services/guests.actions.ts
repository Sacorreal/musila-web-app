'use server'

import { getServerApiClient } from '@/src/shared/api/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';

export async function createGuestsAction(data: any) {
  const client = await getServerApiClient();
  const response = await client.post(apiURLs.guests.base, data);
  return response.data;
}
