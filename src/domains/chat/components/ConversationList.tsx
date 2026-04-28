"use client";

import React from "react";
import { useConversations } from "../hooks/use-chat.hooks";
import { cn } from "@/src/shared/libs/cn";
import { Music2, User2 } from "lucide-react";
import { RequestStatus } from "../../requests/types/request.types";
import { motion } from "framer-motion";
import { StatusBadge } from "../../requests/components/solicitudes/StatusBadge";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";

interface Props {
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export function ConversationList({ selectedChatId, onSelectChat }: Props) {
  const { data: conversations, isLoading } = useConversations();
  const user = useAuthStore((s) => s.user);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading || !mounted) {
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
        {conversations?.map((conv: any, index: number) => {
          const track = conv.track;
          const chatId = conv.chat?.id;
          const requester = conv.requester;
          
          if (!chatId) return null;

          const isActive = selectedChatId === chatId;
          
          // Lógica inteligente para el título
          const isAuthor = track?.authors?.some((a: any) => (typeof a === 'string' ? a === user?.id : a.id === user?.id));
          
          let otherPartyName = "Participante";
          
          if (isAuthor) {
            // Si yo soy el autor, quiero ver quién me solicita (el requester)
            otherPartyName = requester ? `${requester.name} ${requester.lastName}` : "Solicitante";
          } else {
            // Si yo soy el solicitante, quiero ver quién es el autor
            const mainAuthor = track?.authors?.[0];
            otherPartyName = mainAuthor && typeof mainAuthor !== 'string' 
              ? `${mainAuthor.name} ${mainAuthor.lastName}` 
              : "Autor";
          }

          const displayTitle = `${otherPartyName} - ${track?.title || "Sin título"}`;

          return (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={conv.id}
              onClick={() => onSelectChat(chatId)}
              className={cn(
                "flex items-center gap-4 p-4 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.02] text-left border-b border-border/50 group w-full",
                isActive && "bg-primary/5 dark:bg-primary/10 border-r-4 border-r-primary"
              )}
            >
              {/* Track Cover */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {track?.coverUrl ? (
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {/* Status indicator (Dot) */}
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-background shadow-md",
                  conv.status === RequestStatus.PENDIENTE && "bg-amber-400",
                  conv.status === RequestStatus.APROBADA && "bg-emerald-500",
                  conv.status === RequestStatus.RECHAZADA && "bg-red-500",
                  conv.status === RequestStatus.CANCELADA && "bg-slate-400"
                )} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <h3 className={cn(
                  "text-[14px] font-black truncate leading-tight transition-colors",
                  isActive ? "text-primary" : "text-foreground group-hover:text-primary/80"
                )}>
                  {displayTitle}
                </h3>
                <div className="flex items-center justify-between">
                   <StatusBadge status={conv.status} />
                   {conv.unreadCount > 0 && (
                     <div className="bg-primary text-primary-foreground text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 animate-in zoom-in duration-300">
                       {conv.unreadCount > 9 ? '+9' : conv.unreadCount}
                     </div>
                   )}
                </div>
              </div>
            </motion.button>
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
