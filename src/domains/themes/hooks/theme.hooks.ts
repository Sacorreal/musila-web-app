'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/constants/query-keys';
import { fetchThemesRequest } from '../services/theme.actions';

export function useThemes() {
  return useQuery({
    queryKey: queryKeys.themes.all,
    queryFn: fetchThemesRequest,
  });
}
