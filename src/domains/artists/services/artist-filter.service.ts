import { TrackSummary } from '@/src/domains/tracks/types/track.types';

export function getUniqueGenres(tracks: TrackSummary[]): string[] {
  // Check both 'genre' and 'genreId' as the backend field name may vary
  const genres = tracks.map(t => t.genreId || t.genre).filter((g): g is string => typeof g === 'string');
  return Array.from(new Set(genres));
}

export function getUniqueSubGenres(tracks: TrackSummary[], selectedGenre?: string): string[] {
  const filtered = selectedGenre && selectedGenre !== 'all' 
    ? tracks.filter(t => (t.genreId || t.genre) === selectedGenre)
    : tracks;
    
  const subGenres = filtered.map(t => t.subGenre).filter((s): s is string => typeof s === 'string');
  return Array.from(new Set(subGenres));
}

export function filterTracks(
  tracks: TrackSummary[], 
  genre: string, 
  subGenre: string
): TrackSummary[] {
  return tracks.filter(track => {
    const trackGenre = track.genreId || track.genre;
    const genreMatch = genre === 'all' || trackGenre === genre;
    const subGenreMatch = subGenre === 'all' || track.subGenre === subGenre;
    return genreMatch && subGenreMatch;
  });
}
