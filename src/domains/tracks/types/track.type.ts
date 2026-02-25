import { Track } from "../models/track.model";

export type CreateTrackDTO = Pick<
    Track,
    'id'
>

export type UpdateTrackDTO = Partial<Track>

export type TrackResponseDTO = Omit<Track, 'id'>

export interface Language {
    code: string; // ej: 'es', 'en'
    label: string; // ej: 'Español', 'Inglés'
  }

