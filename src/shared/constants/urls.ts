import { BASE_API_URL } from '@shared/constants/env';

export const apiURLs = {
  auth: {
    login: `${BASE_API_URL}/auth/login` as const,
    register: `${BASE_API_URL}/auth/register` as const,
  },
  users: {
    base: `${BASE_API_URL}/users` as const,
    roles: `${BASE_API_URL}/users/roles` as const,
    authors: `${BASE_API_URL}/users/authors` as const,
    authorById: (id: string) => `${BASE_API_URL}/users/author/${id}` as const,
    me: `${BASE_API_URL}/users/me` as const,
    deleteMe: (id: string) => `${BASE_API_URL}/users/me/${id}` as const,
  },
  tracks: {
    base: `${BASE_API_URL}/tracks` as const, // Used for POST and GET (all)
    myTracks: `${BASE_API_URL}/tracks/my-tracks` as const,
    byId: (id: string) => `${BASE_API_URL}/tracks/${id}` as const, // Used for GET, PUT, DELETE
  },
  storage: {
    uploadUrl: `${BASE_API_URL}/storage/upload-url` as const,
    deleteBatch: `${BASE_API_URL}/storage/delete-batch` as const,
  },
  search: {
    base: `${BASE_API_URL}/search` as const,
  },
  playlists: {
    base: `${BASE_API_URL}/playlists` as const, // Used for POST and GET (all)
    byId: (id: string) => `${BASE_API_URL}/playlists/${id}` as const, // Used for GET, PUT, DELETE
  },
  requestedTracks: {
    base: `${BASE_API_URL}/requested-tracks` as const, // POST, GET
    byId: (id: string) => `${BASE_API_URL}/requested-tracks/${id}` as const, // GET, PUT, DELETE
  },
  musicalGenre: {
    base: `${BASE_API_URL}/musical-genre` as const, // POST, GET
    byId: (id: string) => `${BASE_API_URL}/musical-genre/${id}` as const, // GET, PUT, DELETE
  },
  intellectualProperty: {
    base: `${BASE_API_URL}/intellectual-property` as const, // POST, GET
    byId: (id: string) => `${BASE_API_URL}/intellectual-property/${id}` as const, // GET, PUT, DELETE
  },
  languages: {
    base: `${BASE_API_URL}/languages` as const,
  },
  guests: {
    base: `${BASE_API_URL}/guests` as const, // POST, GET
    byId: (id: string) => `${BASE_API_URL}/guests/${id}` as const, // GET, PUT, DELETE
  },
  app: {
    health: `${BASE_API_URL}/` as const,
  }
} as const;

export type ApiURLs = typeof apiURLs;