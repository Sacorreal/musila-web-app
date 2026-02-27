import { Track } from "../models/track.model";


export type UpdateTrackDTO = Partial<Track>

export type TrackResponseDTO = Omit<Track, 'id'>

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
