'use client'

import React, { useState } from 'react';
import { usePlaylists, useUpdatePlaylist, useCreatePlaylist } from '../hooks/use-playlist.hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/shared/components/UI/dialog';
import { Button } from '@/src/shared/components/UI/button';
import { PlaylistIcon, PlusIcon, MusicNoteIcon } from '@/src/shared/components/Icons/icons';
import { CheckIcon } from 'lucide-react';

import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { UserRole } from '@/src/domains/users/types/user.types';

interface AddToPlaylistModalProps {
  trackId: string;
  trackTitle: string;
  children: React.ReactNode;
}

export function AddToPlaylistModal({ trackId, trackTitle, children }: AddToPlaylistModalProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  
  const user = useAuthStore((s) => s.user);
  const isGuest = user?.role === UserRole.INVITADO;

  const { data, isLoading } = usePlaylists();
  const updatePlaylist = useUpdatePlaylist();
  const createPlaylist = useCreatePlaylist();

  const playlists = data?.data || [];

  const handleAddToPlaylist = (playlistId: string, currentTrackIds: string[]) => {
    // Si ya existe, no hacemos nada (aunque el botón debería estar deshabilitado)
    if (currentTrackIds.includes(trackId)) return;

    updatePlaylist.mutate(
      {
        id: playlistId,
        data: {
          trackIds: [...currentTrackIds, trackId],
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        }
      }
    );
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;

    createPlaylist.mutate(
      { title: newPlaylistTitle.trim() },
      {
        onSuccess: (newPlaylist) => {
          setNewPlaylistTitle('');
          setIsCreating(false);
          // Inmediatamente agregamos la pista a la nueva playlist
          handleAddToPlaylist(newPlaylist.id, []);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Agregar a Playlist</DialogTitle>
          <DialogDescription>
            Agrega "{trackTitle}" a una de tus listas de reproducción.
          </DialogDescription>
        </DialogHeader>

        {!isGuest && (
          isCreating ? (
            <form onSubmit={handleCreateAndAdd} className="flex flex-col gap-4 py-4 border-b">
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder="Nombre de la nueva playlist"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} disabled={createPlaylist.isPending}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={!newPlaylistTitle.trim() || createPlaylist.isPending}>
                  {createPlaylist.isPending ? 'Creando...' : 'Crear y Agregar'}
                </Button>
              </div>
            </form>
          ) : (
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 mb-2 border-dashed"
              onClick={() => setIsCreating(true)}
            >
              <PlusIcon className="w-5 h-5" />
              Nueva Playlist
            </Button>
          )
        )}

        <div className="flex-1 overflow-y-auto pr-2 py-2 flex flex-col gap-2">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <p className="text-sm text-muted-foreground">Cargando listas...</p>
            </div>
          ) : playlists.length === 0 && !isCreating ? (
            <div className="flex flex-col items-center justify-center p-6 text-center opacity-70">
              <PlaylistIcon className="w-12 h-12 mb-3" />
              <p className="text-sm">
                {isGuest 
                  ? "Aún no te han invitado a ninguna playlist." 
                  : "No tienes listas creadas aún."}
              </p>
            </div>
          ) : (
            playlists.map((playlist) => {
              const currentTrackIds = playlist.tracks?.map(t => t.id) || [];
              const hasTrack = currentTrackIds.includes(trackId);
              const isUpdatingThis = updatePlaylist.variables?.id === playlist.id && updatePlaylist.isPending;

              return (
                <div 
                  key={playlist.id} 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <MusicNoteIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col truncate pr-2">
                      <span className="font-medium text-sm truncate">{playlist.title}</span>
                      <span className="text-xs text-muted-foreground">{currentTrackIds.length} pistas</span>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={hasTrack ? "secondary" : "default"}
                    className="shrink-0 ml-2"
                    disabled={hasTrack || isUpdatingThis}
                    onClick={() => handleAddToPlaylist(playlist.id, currentTrackIds)}
                  >
                    {isUpdatingThis ? (
                      'Agregando...'
                    ) : hasTrack ? (
                      <>
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Agregada
                      </>
                    ) : (
                      'Agregar'
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
