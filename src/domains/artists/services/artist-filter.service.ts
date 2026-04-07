import { TrackSummary } from '@/src/domains/tracks/types/track.type';

const getTrackGenreId = (track: TrackSummary): string | undefined => {
  const genreField = (track as any).genreId || (track as any).genre || (track as any).musicalGenre || (track as any).musicalGenreId;
  if (!genreField) return undefined;
  if (typeof genreField === 'object') return genreField.id;
  return String(genreField);
};

export function getUniqueGenres(tracks: TrackSummary[]): string[] {
  const genres = tracks.map(getTrackGenreId).filter((g): g is string => !!g);
  return Array.from(new Set(genres));
}

export function getUniqueSubGenres(tracks: TrackSummary[], selectedGenre?: string): string[] {
  const filtered = selectedGenre && selectedGenre !== 'all' 
    ? tracks.filter(t => getTrackGenreId(t) === selectedGenre)
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
    const trackGenreId = getTrackGenreId(track);
    const genreMatch = genre === 'all' || trackGenreId === genre;
    const subGenreMatch = subGenre === 'all' || track.subGenre === subGenre;
    return genreMatch && subGenreMatch;
  });
}
