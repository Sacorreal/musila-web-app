import { BASE_API_URL } from '@shared/constants/env';

export const apiURLs = {
  auth: {
    login: `${BASE_API_URL}/auth/login` as const,
    register: '/auth/register' as const,
    forgotPassword: '/auth/forgot-password' as const,
    resetPassword: '/auth/reset-password' as const,
  },
  users: {
    base: '/users' as const,
    roles: '/users/roles' as const,    
    authors: '/users/authors' as const,
    userById: (id: string) => `/users/${id}` as const,
    me: '/users/me' as const,
    deleteMe: (id: string) => `/users/me/${id}` as const,
  },
  tracks: {
    base: '/tracks' as const, // Used for POST and GET (all)
    myTracks: '/tracks/my-tracks' as const,
    byId: (id: string) => `/tracks/${id}` as const, // Used for GET, PUT, DELETE
  },
  storage: {   
    presignedUrls: '/storage/upload-url' as const,
    deleteBatch: '/storage/delete-batch' as const,
  },
  search: {
    base:'/search' as const,
  },
  genres: {
    base: '/musical-genre' as const,
    byId: (id: string) => `/musical-genre/${id}` as const,
  },
  playlists: {
    base: '/playlists' as const, // Used for POST and GET (all)
    byId: (id: string) => `/playlists/${id}` as const, // Used for GET, PUT, DELETE
  },
  requestedTracks: {
    base: '/requested-tracks' as const, // POST, GET
    byId: (id: string) => `/requested-tracks/${id}` as const, // GET, PUT, DELETE
  },
  musicalGenre: {
    base: '/musical-genre' as const, // POST, GET
    byId: (id: string) => `/musical-genre/${id}` as const, // GET, PUT, DELETE
  },
  intellectualProperty: {
    base: '/intellectual-property' as const, // POST, GET
    byId: (id: string) => `/intellectual-property/${id}` as const, // GET, PUT, DELETE
  },
  languages: {
    base: '/languages' as const,
  },
  guests: {
    base: '/guests' as const, // POST, GET
    byId: (id: string) => `/guests/${id}` as const, // GET, PUT, DELETE
  },
  invites: {
    base: '/invites' as const,
    byToken: (token: string) => `/invites/${token}` as const,
  },
  app: {
    health: `${BASE_API_URL}` as const,
  },
  admin: {
    stats: '/users/admin/stats' as const,
    createAdmin: '/users/admin/create' as const,
  },
  payments: {
    checkout: `${BASE_API_URL}/payments/checkout` as const,
    paymentSources: `${BASE_API_URL}/payments/payment-sources` as const,
    status: (reference: string) => `${BASE_API_URL}/payments/status/${reference}` as const,
    history: `${BASE_API_URL}/payments/history` as const,
    byId: (id: string) => `${BASE_API_URL}/payments/${id}` as const,
    receipt: (id: string) => `${BASE_API_URL}/payments/${id}/receipt` as const,
    pseBanks: `${BASE_API_URL}/payments/pse/banks` as const,
    psePay: `${BASE_API_URL}/payments/pse` as const,
  },
  me: {
    profile: `${BASE_API_URL}/users/me` as const,
    email: `${BASE_API_URL}/users/me/email` as const,
    password: `${BASE_API_URL}/users/me/password` as const,
    avatar: `${BASE_API_URL}/users/me/avatar` as const,
    plan: `${BASE_API_URL}/users/me/plan` as const,
    billing: `${BASE_API_URL}/users/me/billing` as const,
    paymentHistory: `${BASE_API_URL}/users/me/payments` as const,
  },
} as const;

export type ApiURLs = typeof apiURLs;