import { AuthorSummary} from '@domains/artists/types/artist.types'; 
import { PaginatedResponse} from '@shared/types/shared.types'

export type PlaylistOwner = AuthorSummary; 

export interface PlaylistSummary {
  id: string;
  title: string;
  owner: PlaylistOwner;
  cover?: string | null;

  guests: any[]; 
  tracks: PlaylistTrack[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreatePlaylistDTO{ title:string}

export interface PlaylistTrack {
  id: string;
  title: string;
  genre: GenreLite;
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

export type UpdatePlaylistDTO = Partial<PlaylistSummary>

export type AuthorsResponse = PaginatedResponse<PlaylistSummary>;

export interface GenreLite {
  id: string;
  genre: string;
  slug: string;
}