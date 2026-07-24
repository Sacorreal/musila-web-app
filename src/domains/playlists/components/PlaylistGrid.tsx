'use client'

import React, { useState } from 'react';
import { usePlaylists } from '../hooks/use-playlist.hooks';
import { PlaylistCard } from './PlaylistCard';
import { PlaylistSidePanel } from './PlaylistSidePanel';
import { Playlist } from '../types/playlist.types';
import { MusicNoteIcon } from '@/src/shared/components/Icons/icons';
import { CreatePlaylistDialog } from './CreatePlaylistDialog';

import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { UserPlanType } from '@/src/domains/users/types/user.types';

export function PlaylistGrid() {
  const { data, isLoading, isError, error } = usePlaylists();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isGuest = user?.planType === UserPlanType.INVITADO;

  const playlists = data?.data || [];
  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId) || null;

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylistId(playlist.id);
    setIsPanelOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col gap-4 animate-pulse">
            <div className="aspect-square w-full bg-muted rounded-xl"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
            <div className="h-3 w-1/2 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    const errorMsg = (error as any)?.response?.data?.message || (error as any)?.message || 'Error desconocido';
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-medium">Error al cargar las listas de reproducción.</p>
        <p className="text-muted-foreground text-sm mt-1">Detalle: {errorMsg}</p>
        <p className="text-muted-foreground text-sm mt-1">Por favor, intenta recargar la página.</p>
      </div>
    );
  }

  return (
    <>
      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <MusicNoteIcon className="w-12 h-12 text-primary opacity-80" />
          </div>
          <h3 className="text-xl font-bold mb-2">Aún no tienes playlists</h3>
          <p className="text-muted-foreground mb-8">
            {isGuest 
              ? "Aún no te han invitado a una playlist, espera a que tu anfitrión te invite a colaborar." 
              : "Crea tu primera lista de reproducción para empezar a organizar tu música y compartirla con otros colaboradores."}
          </p>
          {!isGuest && <CreatePlaylistDialog />}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mt-8">
          {playlists.map((playlist) => (
            <PlaylistCard 
              key={playlist.id} 
              playlist={playlist} 
              onClick={handlePlaylistClick} 
            />
          ))}
        </div>
      )}

      {/* Side Panel para visualizar los tracks */}
      <PlaylistSidePanel 
        playlist={selectedPlaylist} 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </>
  );
}
