'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { BASE_API_URL } from '@shared/constants/env';

/**
 * Cliente axios exclusivo para el dashboard de afiliados: inyecta la cookie
 * `affiliate_access_token` (aislada de `access_token` del core) como Bearer token.
 */
export async function getAffiliateServerApiClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get('affiliate_access_token')?.value;

  const client = axios.create({
    baseURL: BASE_API_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const url = error.config?.url;
      const status = error.response?.status || 'SIN RESPUESTA';
      const message = error.response?.data?.message || error.message;
      console.error(`[Affiliate API Error] 🚨 [${status}] ${url} - ${message}`);
      return Promise.reject(error);
    },
  );

  return client;
}
