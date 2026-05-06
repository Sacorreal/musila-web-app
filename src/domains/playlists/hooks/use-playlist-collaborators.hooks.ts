import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getPlaylistCollaboratorsAction, 
  addPlaylistCollaboratorAction, 
  removePlaylistCollaboratorAction 
} from '../services/playlist-collaborators.actions';
import { AddCollaboratorInput } from '../types/playlist-collaborator.types';
import { toast } from 'sonner';

export const PLAYLIST_COLLAB_QUERY_KEY = 'playlist-collaborators';

export function usePlaylistCollaborators(playlistId: string | undefined) {
  return useQuery({
    queryKey: [PLAYLIST_COLLAB_QUERY_KEY, playlistId],
    queryFn: () => getPlaylistCollaboratorsAction(playlistId!),
    enabled: !!playlistId,
  });
}

export function useAddPlaylistCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, data }: { playlistId: string; data: AddCollaboratorInput }) => 
      addPlaylistCollaboratorAction(playlistId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_COLLAB_QUERY_KEY, variables.playlistId] });
      toast.success('Colaborador agregado correctamente a la playlist');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al agregar colaborador');
    }
  });
}

export function useAddMultiplePlaylistCollaborators() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, data }: { playlistId: string; data: import('../types/playlist-collaborator.types').AddMultipleCollaboratorsInput }) => 
      import('../services/playlist-collaborators.actions').then(m => m.addMultiplePlaylistCollaboratorsAction(playlistId, data)),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_COLLAB_QUERY_KEY, variables.playlistId] });
      toast.success('Colaboradores agregados correctamente a la playlist');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al agregar colaboradores');
    }
  });
}

export function useRemovePlaylistCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, guestId }: { playlistId: string; guestId: string }) => 
      removePlaylistCollaboratorAction(playlistId, guestId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_COLLAB_QUERY_KEY, variables.playlistId] });
      toast.success('Colaborador eliminado de la playlist');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar colaborador');
    }
  });
}
