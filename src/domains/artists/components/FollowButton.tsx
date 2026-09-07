"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, UserPlus } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { useFollowArtist } from "@/src/domains/follows/hooks/use-follow.hooks";
import { AuthorResponse } from "@/src/domains/artists/types/artist.types";
import { MusicRole } from "@/src/domains/users/types/user.types";

const FOLLOWABLE_ROLES = [MusicRole.COMPOSITOR, MusicRole.CANTAUTOR];

interface FollowButtonProps {
  artist: AuthorResponse;
}

export function FollowButton({ artist }: FollowButtonProps) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { followMutation, unfollowMutation } = useFollowArtist(artist.id);

  const [isFollowing, setIsFollowing] = useState(artist.isFollowingByViewer);
  const [followersCount, setFollowersCount] = useState(artist.followersCount);

  if (!FOLLOWABLE_ROLES.includes(artist.role)) return null;
  if (user?.id === artist.id) return null;

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const handleClick = () => {
    if (!token) {
      router.push("/login");
      return;
    }

    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setFollowersCount((count) => count + (wasFollowing ? -1 : 1));

    const mutation = wasFollowing ? unfollowMutation : followMutation;
    mutation.mutate(undefined, {
      onError: () => {
        setIsFollowing(wasFollowing);
        setFollowersCount((count) => count + (wasFollowing ? 1 : -1));
      },
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={isFollowing}
        variant={isFollowing ? "outline" : "default"}
        className="min-w-[130px] rounded-full px-6 font-semibold shadow-md transition-all"
      >
        {isFollowing ? (
          <>
            <Check className="size-4" /> Siguiendo
          </>
        ) : (
          <>
            <UserPlus className="size-4" /> Seguir
          </>
        )}
      </Button>
      <span className="text-sm text-muted-foreground">
        {new Intl.NumberFormat("es-CO").format(followersCount)} seguidores
      </span>
    </div>
  );
}
