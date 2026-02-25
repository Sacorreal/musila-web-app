import { BASE_API_URL } from '@shared/constants/env';

export const apiURLs = {
  auth: {
    login: `${BASE_API_URL}/auth/login` as const,
    register: `${BASE_API_URL}/auth/register` as const,
  },
  languages: {
    all: `${BASE_API_URL}/languages` as const,
  },
  genres: {
    all: `${BASE_API_URL}/musical-genre` as const,
    byId: (id: string) => `${BASE_API_URL}/musical-genre/${id}` as const,
  },
  tracks: {
    all: `${BASE_API_URL}/tracks` as const,
    search: `${BASE_API_URL}/tracks/search` as const,
    byId: (id: string) => `${BASE_API_URL}/tracks/${id}` as const,
  },
} as const;

// Tipo para usar en tus servicios o mocks
export type ApiURLs = typeof apiURLs;