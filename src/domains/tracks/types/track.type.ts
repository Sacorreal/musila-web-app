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
  genre: string
  isAvailable: boolean
  isGospel: boolean
}