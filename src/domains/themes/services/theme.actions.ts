'use server';

import type { ThemeDto } from '../types/theme.types';
import { apiURLs } from '@/src/shared/constants/urls';
import { getServerApiClient } from '@/src/shared/libs/axios/axios-server';

export async function fetchThemesRequest(): Promise<ThemeDto[]> {
  const client = await getServerApiClient();
  const { data } = await client.get<{ data: ThemeDto[]; total: number }>(apiURLs.themes.base);
  return data.data;
}
