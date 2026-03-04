'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPlaylistAction } from '../services/playlist.actions';

export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlaylistAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}
