'use server';

import type { MoodDto } from '../types/mood.types';
import { apiURLs } from '@/src/shared/constants/urls';
import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';

export async function fetchMoodsRequest(): Promise<MoodDto[]> {
  const client = await getServerApiClient();
  const { data } = await client.get<{ data: MoodDto[]; total: number }>(apiURLs.moods.base);
  return data.data;
}
