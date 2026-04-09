import {PaginatedResponse } from  '@shared/types/shared.types'
import { AuthorsTracks} from '@domains/artists/types/artist.types'
import { PaginationDTO} from '@shared/types/shared.types'


export interface Language {
    code: string; // ej: 'es', 'en'
    label: string; // ej: 'Español', 'Inglés'
  }

export interface CreateTrackDTO {
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

export interface TrackSummary  {
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

export interface TrackDetails {
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
  authors: AuthorsTracks[];
  intellectualProperties: any[];
  playlists: Record<string, any>;
  requestedTrack: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type TracksResponse = PaginatedResponse<TrackSummary>;

export type UpdateTrackDTO = Partial<CreateTrackDTO>

export interface FilterTrackDto extends PaginationDTO {
 isGospel?: boolean;
 genreId?: string;
 subGenre?: string;
 language?: string;
 isAvailable?: boolean;
}

