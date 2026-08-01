"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { followArtistAction, unfollowArtistAction } from "../services/follows.actions";

export function useFollowArtist(artistId: string) {
  const followMutation = useMutation({
    mutationFn: () => followArtistAction(artistId),
    onSuccess: () => {
      toast.success("Ahora sigues a este artista");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo seguir a este artista");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowArtistAction(artistId),
    onSuccess: () => {
      toast.success("Dejaste de seguir a este artista");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo dejar de seguir a este artista");
    },
  });

  return { followMutation, unfollowMutation };
}
