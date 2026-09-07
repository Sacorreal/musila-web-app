"use client";

import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { ShareButton } from "./ShareButton";
import { ShareAccessPanel } from "./ShareAccessPanel";
import { ShareResourceType } from "../types/sharing.types";

interface PlaylistOwnerSharePanelProps {
  ownerId: string;
  playlistId: string;
  playlistTitle: string;
}

/** Botón "Compartir" + panel de gestión de accesos, visibles solo para el dueño de la playlist. */
export function PlaylistOwnerSharePanel({ ownerId, playlistId, playlistTitle }: PlaylistOwnerSharePanelProps) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  if (currentUserId !== ownerId) return null;

  return (
    <div className="flex flex-col gap-4">
      <ShareButton resourceType={ShareResourceType.PLAYLIST} resourceId={playlistId} resourceTitle={playlistTitle} />
      <ShareAccessPanel resourceType={ShareResourceType.PLAYLIST} resourceId={playlistId} />
    </div>
  );
}
