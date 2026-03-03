import { useQuery } from '@tanstack/react-query';
import { fetchGenresRequest } from '../services/genre.actions';
import { queryKeys } from '@/src/shared/constants/query-keys';

export function useGenres() {
  return useQuery({
    queryKey: queryKeys.genres.all, 
    queryFn: fetchGenresRequest,      
  });
}