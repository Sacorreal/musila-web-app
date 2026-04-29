'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { playlistService } from '../services/playlist.service';
import { CreatePlaylistInput, UpdatePlaylistInput } from '../types/playlist.types';
import { toast } from 'sonner';

export function usePlaylists(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['playlists', params],
    queryFn: () => playlistService.getPlaylists(params),
  });
}

export function usePlaylistDetails(id: string | null) {
  return useQuery({
    queryKey: ['playlists', id],
    queryFn: () => playlistService.getPlaylistById(id!),
    enabled: !!id,
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlaylistInput) => playlistService.createPlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Playlist creada correctamente');
    },
    onError: () => {
      toast.error('Error al crear la playlist');
    }
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => playlistService.deletePlaylist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Playlist eliminada correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar la playlist');
    }
  });
}

export function useUpdatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlaylistInput }) => 
      playlistService.updatePlaylist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Playlist actualizada correctamente');
    },
    onError: () => {
      toast.error('Error al actualizar la playlist');
    }
  });
}
