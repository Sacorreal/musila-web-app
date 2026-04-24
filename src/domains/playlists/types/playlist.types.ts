import { AuthorResponse } from '@domains/artists/types/artist.types'; 
import { PaginatedResponse } from '@shared/types/shared.types'

export type PlaylistOwnerDto = AuthorResponse; 

export interface PlaylistResponse {
  id: string;
  title: string;
  owner: PlaylistOwnerDto;
  cover?: string | null;

  guests: any[]; 
  tracks: PlaylistTrackDto[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreatePlaylistInput { title: string }

export interface PlaylistTrackDto {
  id: string;
  title: string;
  genre: GenreLiteDto;
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

export type UpdatePlaylistInput = Partial<PlaylistResponse>

export type PlaylistsResponse = PaginatedResponse<PlaylistResponse>;

export interface GenreLiteDto {
  id: string;
  genre: string;
  slug: string;
}