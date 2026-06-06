'use client'

import React from 'react';
import { CreatePlaylistDialog } from '@/src/domains/playlists/components/CreatePlaylistDialog';
import { PlaylistGrid } from '@/src/domains/playlists/components/PlaylistGrid';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { UserRole } from '@/src/domains/users/types/user.types';

export default function MyMusicPage() {
  const user = useAuthStore((s) => s.user);
  const isGuest = user?.role === UserRole.INVITADO;

  return (
    <div className="flex flex-col w-full min-h-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Mi Música</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus listas de reproducción y colabora con otros artistas.
          </p>
        </div>
        
        {/* Action Button */}
        {!isGuest && (
          <div className="flex items-center gap-3">
            <CreatePlaylistDialog />
          </div>
        )}
      </div>
      
      {/* Divider */}
      <div className="h-px w-full bg-border/50 mt-6 mb-2"></div>

      {/* Main Content Grid */}
      <PlaylistGrid />
    </div>
  );
}