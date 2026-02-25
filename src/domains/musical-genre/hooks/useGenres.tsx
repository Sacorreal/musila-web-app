import { useQuery } from '@tanstack/react-query';
import { fetchGenresRequest } from '../services/genre.service';
import { queryKeys } from '@/src/shared/constants/queryKeys';

export function useGenres() {
  return useQuery({
    queryKey: queryKeys.genres.all, 
    queryFn: fetchGenresRequest,      
  });
}