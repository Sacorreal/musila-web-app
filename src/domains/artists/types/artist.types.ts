import { UserRole } from '@domains/users/types/user.types'
import { MusicalGenreDto } from '@domains/musical-genre/types/musical-genre.types'
import { PaginatedResponse } from '@shared/types/shared.types'

export interface AuthorResponse {
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

export type AuthorTrackDto = Pick<
  AuthorResponse,
  | 'email' | 'id' | 'name' | 'lastName' | 'role'
>

export interface AuthorTrackDetailDto {
  id: string;
  title: string;
  genre: MusicalGenreDto,
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

export interface AuthorPlaylistDto {
  id: string;
  title: string;
  cover: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


export interface AuthorDetailResponse {
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
  tracks: AuthorTrackDetailDto[];

  preferredGenres: any[];
  guests: any[];
  requestSent: any[];

  isUserFree: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  playlists: AuthorPlaylistDto[];
}

export type AuthorsResponse = PaginatedResponse<AuthorResponse>;