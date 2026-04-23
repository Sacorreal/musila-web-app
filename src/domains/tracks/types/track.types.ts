import { PaginatedResponse } from '@shared/types/shared.types'
import { AuthorsResponseDto } from '@domains/artists/types/artist.types'
import { PaginationInput } from '@shared/types/shared.types'


export interface LanguageDto {
  code: string; // ej: 'es', 'en'
  label: string; // ej: 'Español', 'Inglés'
}

export type AuthorTrackDto = Pick<
  AuthorsResponseDto,
  | 'email' | 'id' | 'name' | 'role'
>


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

export interface TracksResponseDto {
  id: string;
  title: string;
  genre: string;
  subGenre: string;
  coverUrl: string;
  audioUrl: string | null;
  year: number;
  audioKey: string;
  language: string;
  lyric: string;
  externalsIds: Record<string, unknown> | null;
  isAvailable: boolean;
  isGospel: boolean;
  coverKey: string | null;
  authors: string[];
  intellectualProperties: string[];

  playlists: string[]
  requestedTrack: string[]

  createdAt: string;
  updatedAt: string;
}

export interface TrackResponse {
  id: string;
  title: string;
  genre: string;
  subGenre: string;
  coverUrl: string;
  audioUrl: string | null;
  year: number;
  audioKey: string;
  language: string;
  lyric: string;
  externalsIds: Record<string, unknown> | null;
  isAvailable: boolean;
  isGospel: boolean;
  coverKey: string | null;
  intellectualProperties: string[];
  playlists: PlaylistTrackDto[];
  requestedTrack: string[];
  createdAt: string;
  updatedAt: string;
  authors: AuthorTrackDto[];

}

export interface PlaylistTrackDto {
  id: string;
  title: string;
  cover: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type TracksResponse = PaginatedResponse<TracksResponseDto>;

export type UpdateTrackInput = Partial<CreateTrackInput>

export interface FilterTrackInput extends PaginationInput {
  isGospel?: boolean;
  genreId?: string;
  subGenre?: string;
  language?: string;
  isAvailable?: boolean;
}



export interface CreateRequestedTrackInput {
  trackId: string;
  licenseType: LicenseType;
}

export enum LicenseType {
  LICENCIA_DE_PRIMER_USO = 'licencia de primer uso',
  LICENCIA_TRADUCCION = 'licencia traduccion',
  LICENCIA_REPRODUCCION = 'licencia reproduccion',
  LICENCIA_SINCRONIZACION = 'licencia sincronizacion'
}