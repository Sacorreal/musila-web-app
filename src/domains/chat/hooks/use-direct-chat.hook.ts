"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { chatService } from "../services/chat.service";

/**
 * Inicia (o recupera) un chat directo con otro usuario. Semántica get-or-create:
 * si ya existe una conversación entre ambos, el backend devuelve la existente.
 */
export function useCreateDirectChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) => chatService.createDirectChat(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "No se pudo iniciar la conversación",
      );
    },
  });
}
