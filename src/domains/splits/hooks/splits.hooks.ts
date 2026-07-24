"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveSplitAction,
  createSplitAction,
  getSplitByTrackAction,
  rejectSplitAction,
  searchCoauthorByCreatorIdAction,
  updateSplitAction,
} from "../services/splits.actions";
import { CreateSplitInput } from "../types/splits.types";

export const SPLIT_QUERY_KEY = "split";

export function useSplitByTrack(trackId: string | undefined) {
  return useQuery({
    queryKey: [SPLIT_QUERY_KEY, trackId],
    queryFn: () => getSplitByTrackAction(trackId!),
    enabled: !!trackId,
  });
}

export function useCreateSplit(trackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSplitInput) => createSplitAction(trackId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SPLIT_QUERY_KEY, trackId] });
      toast.success("Split creado. Se notificó a cada coautor para su aprobación.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo crear el split");
    },
  });
}

export function useUpdateSplit(trackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ splitId, data }: { splitId: string; data: CreateSplitInput }) =>
      updateSplitAction(splitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SPLIT_QUERY_KEY, trackId] });
      toast.success("Split actualizado. Se reenvió la solicitud de aprobación a los coautores.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo actualizar el split");
    },
  });
}

export function useApproveSplit(trackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (splitId: string) => approveSplitAction(splitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SPLIT_QUERY_KEY, trackId] });
      toast.success("Aprobaste tu participación en el split");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo aprobar el split");
    },
  });
}

export function useRejectSplit(trackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ splitId, reason }: { splitId: string; reason: string }) =>
      rejectSplitAction(splitId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SPLIT_QUERY_KEY, trackId] });
      toast.success("Rechazaste tu participación en el split");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo rechazar el split");
    },
  });
}

export function useSearchCoauthor() {
  return useMutation({
    mutationFn: (musilaCreatorId: string) => searchCoauthorByCreatorIdAction(musilaCreatorId),
  });
}
