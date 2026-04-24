'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGuestsAction } from '../services/guests.actions';

export function useCreateGuests() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGuestsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestss'] });
    },
  });
}
