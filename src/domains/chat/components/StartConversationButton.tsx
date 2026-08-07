"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { useCreateDirectChat } from "@/src/domains/chat/hooks/use-direct-chat.hook";
import { AuthorResponse } from "@/src/domains/artists/types/artist.types";

interface StartConversationButtonProps {
  artist: AuthorResponse;
}

export function StartConversationButton({ artist }: StartConversationButtonProps) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { mutateAsync, isPending } = useCreateDirectChat();

  // No tiene sentido escribirse a uno mismo.
  if (user?.id === artist.id) return null;

  const handleClick = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    const { chatId } = await mutateAsync(artist.id);
    router.push(`/music/chat?chatId=${chatId}`);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      variant="outline"
      className="min-w-[130px] rounded-full px-6 font-semibold shadow-md transition-all"
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> Abriendo…
        </>
      ) : (
        <>
          <MessageCircle className="size-4" /> Enviar mensaje
        </>
      )}
    </Button>
  );
}
