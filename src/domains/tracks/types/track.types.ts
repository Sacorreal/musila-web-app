import { PaginatedResponse } from '@shared/types/shared.types'
import { AuthorTrackDto } from '@domains/artists/types/artist.types'
import { PaginationInput } from '@shared/types/shared.types'


export interface LanguageDto {
    code: string; // ej: 'es', 'en'
    label: string; // ej: 'Español', 'Inglés'
  }

export interface CreateTrackInput {
  title: string;
  genreId: string;
  subGenre?: string;
  language: string;
  lyric: string;
  authorsIds: string[];
  isAvailable?: boolean;
  isGospel: boolean;
  audioKey: string;
  audioUrl: string;
  coverKey?: string;
  coverUrl?: string; 
}

export interface TrackResponse  {
  id: string
  title: string
  genre: string
  subGenre: string
  coverUrl?: string
  audioUrl?: string
  year: number
  audioKey: string
  language: string
  lyric: string
  externalsIds: any
  isAvailable: boolean
  isGospel: boolean
  coverKey: any  
  createdAt: string
  updatedAt: string
}

export interface TrackDetailResponse {
  id: string;
  title: string;
  genre: string;
  subGenre: string;
  coverUrl?: string | null;
  audioUrl: string;
  year: number;
  audioKey?: string | null
  language: string;
  lyric: string;
  externalsIds: any;
  isAvailable: boolean;
  isGospel: boolean;
  coverKey: string;
  authors: AuthorTrackDto[];
  intellectualProperties: any[];
  playlists: Record<string, any>;
  requestedTrack: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type TracksResponse = PaginatedResponse<TrackResponse>;

export type UpdateTrackInput = Partial<CreateTrackInput>

export interface FilterTrackInput extends PaginationInput {
 isGospel?: boolean;
 genreId?: string;
 subGenre?: string;
 language?: string;
 isAvailable?: boolean;
}

