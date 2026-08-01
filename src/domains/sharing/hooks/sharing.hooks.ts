"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  authorizeRecipientAction,
  createPlaylistShareLinkAction,
  createProfileShareLinkAction,
  createTrackShareLinkAction,
  listAuthorizedRecipientsAction,
  listMyShareLinksAction,
  listShareAccessLogAction,
  revokeRecipientAction,
  revokeShareLinkAction,
  searchUserByCreatorIdAction,
} from "../services/sharing.actions";
import { ShareResourceType } from "../types/sharing.types";

export const SHARE_QUERY_KEY = "share";

export function useMyShareLinks() {
  return useQuery({
    queryKey: [SHARE_QUERY_KEY, "mine"],
    queryFn: () => listMyShareLinksAction(),
  });
}

export function useCreateShareLink(resourceType: ShareResourceType, resourceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expiresInDays?: number) => {
      if (resourceType === ShareResourceType.PROFILE) return createProfileShareLinkAction(expiresInDays);
      if (resourceType === ShareResourceType.PLAYLIST)
        return createPlaylistShareLinkAction(resourceId, expiresInDays);
      return createTrackShareLinkAction(resourceId, expiresInDays);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHARE_QUERY_KEY, resourceType, resourceId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo generar el enlace para compartir");
    },
  });
}

export function useRevokeShareLink(shareLinkId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => revokeShareLinkAction(shareLinkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHARE_QUERY_KEY] });
      toast.success("Enlace revocado");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo revocar el enlace");
    },
  });
}

export function useAuthorizedRecipients(shareLinkId: string | undefined) {
  return useQuery({
    queryKey: [SHARE_QUERY_KEY, "recipients", shareLinkId],
    queryFn: () => listAuthorizedRecipientsAction(shareLinkId!),
    enabled: !!shareLinkId,
  });
}

export function useAuthorizeRecipient(shareLinkId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (musilaCreatorId: string) => authorizeRecipientAction(shareLinkId, musilaCreatorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHARE_QUERY_KEY, "recipients", shareLinkId] });
      toast.success("Usuario autorizado. Se le notificó por email.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo autorizar al usuario");
    },
  });
}

export function useRevokeRecipient(shareLinkId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipientId: string) => revokeRecipientAction(shareLinkId, recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHARE_QUERY_KEY, "recipients", shareLinkId] });
      toast.success("Acceso revocado");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo revocar el acceso");
    },
  });
}

export function useShareAccessLog(shareLinkId: string | undefined, pagination: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: [SHARE_QUERY_KEY, "access-log", shareLinkId, pagination],
    queryFn: () => listShareAccessLogAction(shareLinkId!, pagination),
    enabled: !!shareLinkId,
  });
}

export function useSearchUserByCreatorId() {
  return useMutation({
    mutationFn: (musilaCreatorId: string) => searchUserByCreatorIdAction(musilaCreatorId),
  });
}
