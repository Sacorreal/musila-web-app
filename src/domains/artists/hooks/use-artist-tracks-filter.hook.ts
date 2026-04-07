'use client'

import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { TrackSummary } from '@/src/domains/tracks/types/track.type';

interface FilterForm {
  subGenre: string;
}

export function useArtistTracksFilter(tracks: TrackSummary[]) {
  const { watch, setValue } = useForm<FilterForm>({
    defaultValues: { subGenre: 'all' },
  });

  const selectedSubGenre = watch('subGenre');

  // Derive unique subGenre values present in this artist's tracks
  const subGenreOptions = useMemo(() => {
    const values = tracks
      .map(t => t.subGenre)
      .filter((s): s is string => typeof s === 'string' && s.trim() !== '');
    return Array.from(new Set(values));
  }, [tracks]);

  // Apply filter
  const filteredTracks = useMemo(() => {
    if (selectedSubGenre === 'all') return tracks;
    return tracks.filter(t => t.subGenre === selectedSubGenre);
  }, [tracks, selectedSubGenre]);

  const handleSubGenreChange = (value: string) => {
    setValue('subGenre', value);
  };

  return {
    selectedSubGenre,
    subGenreOptions,
    filteredTracks,
    handleSubGenreChange,
  };
}
