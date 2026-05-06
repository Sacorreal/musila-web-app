'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';
import { apiURLs } from '@/src/shared/constants/urls';
import { GuestResponse, PaginatedGuestsResponse, UpdateGuestInput } from '../types/guests.types';

export async function getGuestsAction(page = 1, limit = 10): Promise<PaginatedGuestsResponse> {
  const client = await getServerApiClient();
  const offset = (page - 1) * limit;
  const response = await client.get<PaginatedGuestsResponse>(apiURLs.guests.base, {
    params: { limit, offset }
  });
  return response.data;
}

export async function getGuestByIdAction(id: string): Promise<GuestResponse> {
  const client = await getServerApiClient();
  const response = await client.get<GuestResponse>(`${apiURLs.guests.base}/${id}`);
  return response.data;
}

export async function updateGuestAction(id: string, data: UpdateGuestInput): Promise<GuestResponse> {
  const client = await getServerApiClient();
  const response = await client.put<GuestResponse>(`${apiURLs.guests.base}/${id}`, data);
  return response.data;
}

export async function deleteGuestAction(id: string): Promise<void> {
  const client = await getServerApiClient();
  await client.delete(`${apiURLs.guests.base}/${id}`);
}
