"use client";

import React from "react";
import { useConversations } from "../hooks/use-chat.hooks";
import { cn } from "@/src/shared/libs/cn";
import { Music2 } from "lucide-react";
import { RequestStatus } from "../../requests/types/request.types";

interface Props {
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export function ConversationList({ selectedChatId, onSelectChat }: Props) {
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 w-full bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Conversaciones</h2>
      </div>
      <div className="flex flex-col">
        {conversations?.map((conv: any) => {
          const track = conv.track;
          const chatId = conv.chat?.id;
          
          if (!chatId) return null;

          const isActive = selectedChatId === chatId;

          return (
            <button
              key={conv.id}
              onClick={() => onSelectChat(chatId)}
              className={cn(
                "flex items-center gap-4 p-4 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.02] text-left border-b border-border/50",
                isActive && "bg-primary/5 dark:bg-primary/10 border-r-4 border-r-primary"
              )}
            >
              {/* Track Cover */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-md">
                  {track?.coverUrl ? (
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {/* Status indicator */}
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background shadow-sm",
                  conv.status === RequestStatus.PENDIENTE && "bg-amber-400",
                  conv.status === RequestStatus.APROBADA && "bg-emerald-500",
                  conv.status === RequestStatus.RECHAZADA && "bg-red-500",
                  conv.status === RequestStatus.CANCELADA && "bg-slate-400"
                )} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className={cn(
                    "text-[15px] font-bold truncate",
                    isActive ? "text-primary" : "text-foreground"
                  )}>
                    {track?.title || "Sin título"}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground truncate font-medium">
                  {conv.status === RequestStatus.PENDIENTE && 'Solicitud pendiente'}
                  {conv.status === RequestStatus.APROBADA && 'Solicitud aprobada'}
                  {conv.status === RequestStatus.RECHAZADA && 'Solicitud rechazada'}
                  {conv.status === RequestStatus.CANCELADA && 'Solicitud cancelada'}
                </p>
              </div>
            </button>
          );
        })}

        {conversations?.length === 0 && (
          <div className="p-10 text-center flex flex-col items-center gap-3 opacity-50">
            <Music2 className="w-10 h-10" />
            <p className="text-sm font-medium">No hay conversaciones</p>
          </div>
        )}
      </div>
    </div>
  );
}
