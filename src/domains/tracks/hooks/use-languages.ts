import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/constants/query-keys'; 
import { fetchLanguages} from '@/src/domains/tracks/services/languages.actions'


export function useLanguages() {
  return useQuery({
    queryKey: queryKeys.languages.all,
    queryFn: fetchLanguages,    
  });
}