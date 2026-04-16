import { TrackResponse } from '@/src/domains/tracks/types/track.types';

export function getUniqueGenres(tracks: TrackResponse[]): string[] {
  const genres = tracks.map(t => t.genre).filter((g): g is string => typeof g === 'string');
  return Array.from(new Set(genres));
}

export function getUniqueSubGenres(tracks: TrackResponse[], selectedGenre?: string): string[] {
  const filtered = selectedGenre && selectedGenre !== 'all' 
    ? tracks.filter(t => t.genre === selectedGenre)
    : tracks;
    
  const subGenres = filtered.map(t => t.subGenre).filter((s): s is string => typeof s === 'string');
  return Array.from(new Set(subGenres));
}

export function filterTracks(
  tracks: TrackResponse[], 
  genre: string, 
  subGenre: string
): TrackResponse[] {
  return tracks.filter(track => {
    const genreMatch = genre === 'all' || track.genre === genre;
    const subGenreMatch = subGenre === 'all' || track.subGenre === subGenre;
    return genreMatch && subGenreMatch;
  });
}
