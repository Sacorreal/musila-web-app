"use client";

import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { MusicRole } from "@/src/domains/users/types/user.types";
import { AuthorResponse } from "@/src/domains/artists/types/artist.types";
import { ShareButton } from "./ShareButton";
import { ShareResourceType } from "../types/sharing.types";

const SHAREABLE_PROFILE_ROLES = [MusicRole.COMPOSITOR, MusicRole.CANTAUTOR];

interface ProfileShareButtonProps {
  artist: AuthorResponse;
}

/** Botón "Compartir perfil", visible solo para el propio dueño con rol compositor/cantautor. */
export function ProfileShareButton({ artist }: ProfileShareButtonProps) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  if (currentUserId !== artist.id) return null;
  if (!SHAREABLE_PROFILE_ROLES.includes(artist.role)) return null;

  return (
    <ShareButton
      resourceType={ShareResourceType.PROFILE}
      resourceId={artist.id}
      resourceTitle={`${artist.name} ${artist.lastName}`}
    />
  );
}
