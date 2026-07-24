'use client'

import React from 'react';
import { CreatePlaylistDialog } from '@/src/domains/playlists/components/CreatePlaylistDialog';
import { PlaylistGrid } from '@/src/domains/playlists/components/PlaylistGrid';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { UserPlanType } from '@/src/domains/users/types/user.types';
import { PageHeader } from '@/src/shared/components/UI/PageHeader';

export default function MyMusicPage() {
  const user = useAuthStore((s) => s.user);
  const isGuest = user?.planType === UserPlanType.INVITADO;

  return (
    <div className="flex flex-col w-full min-h-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8">
      <PageHeader
        title="Mi Música"
        titleClassName="text-2xl sm:text-3xl font-black"
        description="Gestiona tus listas de reproducción y colabora con otros artistas."
        actions={!isGuest && <CreatePlaylistDialog />}
        className="mb-2"
      />

      <div className="h-px w-full bg-border/50 mt-6 mb-2" />

      <PlaylistGrid />
    </div>
  );
}
