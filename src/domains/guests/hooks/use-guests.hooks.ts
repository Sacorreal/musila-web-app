'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getGuestsAction, 
  updateGuestAction, 
  deleteGuestAction 
} from '../services/guests.actions';
import { UpdateGuestInput } from '../types/guests.types';
import { toast } from 'sonner';

export const GUESTS_QUERY_KEY = ['guests'];

export function useGuests(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...GUESTS_QUERY_KEY, page, limit],
    queryFn: () => getGuestsAction(page, limit),
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGuestInput }) => 
      updateGuestAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUESTS_QUERY_KEY });
      toast.success('Invitado actualizado correctamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el invitado');
    }
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGuestAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUESTS_QUERY_KEY });
      toast.success('Invitado eliminado correctamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar el invitado');
    }
  });
}
