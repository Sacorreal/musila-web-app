'use client'

import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { TrackResponse } from '@/src/domains/tracks/types/track.types';
import { MusicalGenreDto } from '@/src/domains/musical-genre/types/musical-genre.types';

interface FilterForm {
  genre: string;
  subGenre: string;
}

// Helper: extract genre name string from either a populated object or a plain string
export function resolveGenreName(genre: MusicalGenreDto | string | undefined): string {
  if (!genre) return '';
  if (typeof genre === 'object') return genre.genre;
  return genre;
}

export function useArtistTracksFilter(tracks: TrackResponse[]) {
  const { watch, setValue } = useForm<FilterForm>({
    defaultValues: { genre: 'all', subGenre: 'all' },
  });

  const selectedGenre = watch('genre');
  const selectedSubGenre = watch('subGenre');

  // Unique genre names from this artist's tracks
  const genreOptions = useMemo(() => {
    const values = tracks
      .map(t => resolveGenreName(t.genre))
      .filter(g => g !== '');
    return Array.from(new Set(values));
  }, [tracks]);

  // Unique subGenre names — filtered by selected genre if one is active
  const subGenreOptions = useMemo(() => {
    const source = selectedGenre !== 'all'
      ? tracks.filter(t => resolveGenreName(t.genre) === selectedGenre)
      : tracks;
    const values = source
      .map(t => t.subGenre)
      .filter((s): s is string => typeof s === 'string' && s.trim() !== '');
    return Array.from(new Set(values));
  }, [tracks, selectedGenre]);

  // Apply both filters
  const filteredTracks = useMemo(() => {
    return tracks.filter(t => {
      const genreName = resolveGenreName(t.genre);
      const genreMatch = selectedGenre === 'all' || genreName === selectedGenre;
      const subGenreMatch = selectedSubGenre === 'all' || t.subGenre === selectedSubGenre;
      return genreMatch && subGenreMatch;
    });
  }, [tracks, selectedGenre, selectedSubGenre]);

  const handleGenreChange = (value: string) => {
    setValue('genre', value);
    setValue('subGenre', 'all'); // reset subGenre when genre changes
  };

  const handleSubGenreChange = (value: string) => {
    setValue('subGenre', value);
  };

  return {
    selectedGenre,
    selectedSubGenre,
    genreOptions,
    subGenreOptions,
    filteredTracks,
    handleGenreChange,
    handleSubGenreChange,
  };
}
