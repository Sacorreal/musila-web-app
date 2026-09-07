'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/constants/query-keys';
import { fetchMoodsRequest } from '../services/mood.actions';

export function useMoods() {
  return useQuery({
    queryKey: queryKeys.moods.all,
    queryFn: fetchMoodsRequest,
  });
}
