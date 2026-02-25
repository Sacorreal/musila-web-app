import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/queryKeys'; 
import { fetchLanguages} from '@domains/tracks/services/languages.service'


export function useLanguages() {
  return useQuery({
    queryKey: queryKeys.languages.all,
    queryFn: fetchLanguages,    
  });
}