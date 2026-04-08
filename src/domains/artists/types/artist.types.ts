import { UserRole} from '@domains/users/types/user.types'
import {MusicalGenre } from '@domains/musical-genre/types/musical-genre.types'
import { PaginatedResponse} from '@shared/types/shared.types'

export interface AuthorSummary {
  id: string;
  name: string;
  secondName?: string | null;
  lastName: string;
  secondLastName?: string | null;
  email: string;
  countryCode: string;
  phone: string;
  typeCitizenID?: string | null;
  citizenID?: string | null;
  role: UserRole
  avatar?: string | null;
  isVerified: boolean;
  biography?: string | null;
  socialNetworks?: any;
  isUserFree: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
 
} 

export type AuthorsTracks = Pick<
  AuthorSummary,
  | 'email' | 'id'|'name'|'role'
>

export interface AuthorTrack {
  id: string;
  title: string;
  genre: MusicalGenre,
  subGenre: string;
  coverUrl?: string | null;
  audioUrl?: string | null;
  year: number;
  audioKey: string;
  language: string;
  lyric: string;
  externalsIds: any;
  isAvailable: boolean;
  isGospel: boolean;
  coverKey: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AuthorPlaylist {
  id: string;
  title: string;
  cover: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


export interface AuthorDetails {
  id: string;
  name: string;
  secondName?: string | null;
  lastName: string;
  secondLastName?: string | null;
  email: string;
  countryCode: string;
  phone: string;
  typeCitizenID?: string | null;
  citizenID?: string | null;
  role: string;
  avatar?: string | null;
  isVerified: boolean;
  biography?: string | null;
  socialNetworks?: any;
  tracks: AuthorTrack[];

  preferredGenres: any[];
  guests: any[];
  requestSent: any[];

  isUserFree: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  playlists: AuthorPlaylist[];
}

export type AuthorsResponse = PaginatedResponse<AuthorSummary>;