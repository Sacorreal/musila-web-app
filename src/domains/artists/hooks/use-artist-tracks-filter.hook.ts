'use client'

import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrackSummary } from '@/src/domains/tracks/types/track.type';
import { tracksService } from '@/src/domains/tracks/services/tracks.client';
import { MusicalGenre } from '@/src/domains/musical-genre/types/musical-genre.types';
import { 
  getUniqueGenres, 
  getUniqueSubGenres, 
  filterTracks 
} from '../services/artist-filter.service';

interface FilterForm {
  genre: string;
  subGenre: string;
}

export function useArtistTracksFilter(tracks: TrackSummary[]) {
  // 1. Fetch genres using the CLIENT-side service (tracksService uses axios-client, not the server action)
  const { data: musicalGenres = [] } = useQuery<MusicalGenre[]>({
    queryKey: ['musical-genres'],
    queryFn: async () => {
      const result = await tracksService.getGenres<MusicalGenre[]>();
      return result.data ?? [];
    },
  });

  // 2. Create a map of genre ID → genre name
  const genreIdToName = useMemo(() => {
    const map: Record<string, string> = {};
    musicalGenres.forEach((g: MusicalGenre) => {
      map[g.id] = g.genre;
    });
    return map;
  }, [musicalGenres]);

  const { watch, setValue, control } = useForm<FilterForm>({
    defaultValues: {
      genre: 'all',
      subGenre: 'all',
    },
  });

  const selectedGenre = watch('genre'); // This will be the ID
  const selectedSubGenre = watch('subGenre');

  // Derive unique options (using IDs for internal logic)
  const genreIds = useMemo(() => getUniqueGenres(tracks), [tracks]);
  
  // Create objects for the select UI with { id, name }
  const genreOptions = useMemo(() => {
    return genreIds.map(id => ({
      id,
      name: genreIdToName[id] || 'Cargando...'
    }));
  }, [genreIds, genreIdToName]);

  const subGenres = useMemo(() => getUniqueSubGenres(tracks, selectedGenre), [tracks, selectedGenre]);

  // Apply filters using IDs
  const filteredTracks = useMemo(() => {
    return filterTracks(tracks, selectedGenre, selectedSubGenre);
  }, [tracks, selectedGenre, selectedSubGenre]);

  const handleGenreChange = (value: string) => {
    setValue('genre', value);
    setValue('subGenre', 'all'); // Reset subgenre when genre changes
  };

  const handleSubGenreChange = (value: string) => {
    setValue('subGenre', value);
  };

  return {
    control,
    selectedGenre,
    selectedSubGenre,
    genreOptions,
    subGenres,
    filteredTracks,
    genreIdToName, // To resolve names in the list too
    handleGenreChange,
    handleSubGenreChange,
  };
}

