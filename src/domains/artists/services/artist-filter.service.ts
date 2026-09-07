import { TrackResponse } from '@/src/domains/tracks/types/track.types';

export function getUniqueGenres(tracks: TrackResponse[]): string[] {
  const genres = tracks.map(t => t.genre).filter((g): g is string => typeof g === 'string');
  return Array.from(new Set(genres));
}

export function getUniqueRitmos(tracks: TrackResponse[], selectedGenre?: string): string[] {
  const filtered = selectedGenre && selectedGenre !== 'all'
    ? tracks.filter(t => t.genre === selectedGenre)
    : tracks;

  const ritmos = filtered.map(t => t.ritmo).filter((s): s is string => typeof s === 'string');
  return Array.from(new Set(ritmos));
}

export function filterTracks(
  tracks: TrackResponse[],
  genre: string,
  ritmo: string
): TrackResponse[] {
  return tracks.filter(track => {
    const genreMatch = genre === 'all' || track.genre === genre;
    const ritmoMatch = ritmo === 'all' || track.ritmo === ritmo;
    return genreMatch && ritmoMatch;
  });
}
