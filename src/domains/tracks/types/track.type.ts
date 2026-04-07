import { MusicalGenre } from '@/src/domains/musical-genre/types/musical-genre.types';

export interface AuthorSummary {
  id: string;
  name: string;
  lastName: string;
  secondName?: string;
  secondLastName?: string;
  avatar?: string;
}

export interface Language {
    code: string; // ej: 'es', 'en'
    label: string; // ej: 'Español', 'Inglés'
  }

export interface CreateTrackPayload {
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

export interface TrackSummary {
  id: string
  title: string
  coverUrl?: string
  audioUrl?: string
  genre?: MusicalGenre | string // Backend populates as full MusicalGenre object
  subGenre?: string             // Plain string (e.g. "Rock Alternativo")
  album?: string
  isAvailable: boolean
  isGospel: boolean
  lyric?: string
  authors?: AuthorSummary[]
}