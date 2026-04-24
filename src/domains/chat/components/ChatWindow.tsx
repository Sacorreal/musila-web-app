"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useChatMessages } from "../hooks/use-chat.hooks";
import { useQueryClient } from "@tanstack/react-query";
import { chatSocketService } from "../services/chat-socket.service";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { Send, Music2, MoreVertical, Paperclip } from "lucide-react";
import { cn } from "@/src/shared/libs/cn";
import { Button } from "@/src/shared/components/UI/button";

interface Props {
  chatId: string;
}

export function ChatWindow({ chatId }: Props) {
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();

  // 📦 Historial persistido desde la BD (react-query lo cachea por chatId)
  const { data: history = [], isLoading } = useChatMessages(chatId);

  // 💬 Mensajes nuevos (optimistas + tiempo real) solo para este chatId activo
  const [liveMessages, setLiveMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Limpiar mensajes en vivo al cambiar de conversación
  useEffect(() => {
    setLiveMessages([]);
    setInputValue("");
  }, [chatId]);

  // Cuando el historial se recarga desde la BD, limpiar mensajes optimistas
  // (ya están confirmados en la BD, no hace falta mostrarlos como "Enviando...")
  useEffect(() => {
    if (history && history.length > 0) {
      setLiveMessages((prev) => prev.filter((m) => !m.id.startsWith("optimistic-")));
    }
  }, [history]);

  // Combinar historial (BD) + mensajes en vivo sin duplicados
  const allMessages = useMemo(() => {
    const historyIds = new Set(history.map((m: any) => m.id));
    const uniqueLive = liveMessages.filter((m) => !historyIds.has(m.id));
    return [...history, ...uniqueLive];
  }, [history, liveMessages]);

  // Manejar mensajes en tiempo real desde el socket
  useEffect(() => {
    if (!token || !user?.id) return;

    const currentUserId = user.id;
    console.log("[ChatWindow] Suscribiendo a eventos para chat:", chatId);
    const socket = chatSocketService.connect(token);

    if (socket) {
      chatSocketService.joinChat(chatId);

      const handleNewMessage = (payload: any) => {
        console.log("[ChatWindow] Evento socket recibido:", payload);
        if (payload.chatId === chatId) {
          setLiveMessages((prev) => {
            // Evitar duplicados por ID real
            if (prev.some((m) => m.id === payload.messageId)) return prev;

            // Limpiar mensajes optimistas comparando el contenido
            const isFromMe = payload.senderId === currentUserId;
            const filtered = isFromMe 
              ? prev.filter(m => !m.id.startsWith("optimistic-") || m.content.trim() !== payload.content.trim())
              : prev;

            return [...filtered, {
              id: payload.messageId,
              content: payload.content,
              sender: { id: payload.senderId },
              createdAt: new Date().toISOString(),
            }];
          });

          // Invalidar para asegurar sincronización con la BD
          queryClient.invalidateQueries({ queryKey: ["chat", chatId, "messages"] });
        }
      };

      socket.on("chat.message.sent", handleNewMessage);

      return () => {
        console.log("[ChatWindow] Limpiando suscripción de chat:", chatId);
        socket.off("chat.message.sent", handleNewMessage);
      };
    }
  }, [chatId, token, user?.id, queryClient]);

  // Auto-scroll al fondo
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages]);

  const handleSend = () => {
    if (!inputValue.trim() || !user) return;

    const content = inputValue.trim();

    // Actualización optimista: mostrar inmediatamente en la UI
    setLiveMessages((prev) => [
      ...prev,
      {
        id: `optimistic-${Date.now()}`,
        content,
        sender: { id: user.id },
        createdAt: new Date().toISOString(),
      },
    ]);
    setInputValue("");

    // Enviar por socket para persistencia y notificación al otro participante
    chatSocketService.sendMessage({
      chatId,
      userId: user.id,
      content,
      type: "TEXT",
    });

    // Red de seguridad: recargar historial desde la BD después de 1.5s
    // Esto reemplaza el mensaje optimista con el confirmado y garantiza persistencia
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId, "messages"] });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-white/[0.01]">
        <div className="flex flex-col items-center gap-4 opacity-30">
          <Music2 className="w-12 h-12 animate-bounce" />
          <p className="font-bold">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-black/20">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-background border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Music2 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-bold text-foreground">Chat en vivo</h2>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Área de mensajes */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {allMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
            <Music2 className="w-10 h-10" />
            <p className="text-sm font-medium">Aún no hay mensajes. ¡Sé el primero!</p>
          </div>
        )}

        {allMessages.map((msg, index) => {
          const isMe = msg.sender?.id === user?.id;
          const isOptimistic = msg.id?.startsWith("optimistic-");
          return (
            <div
              key={msg.id || index}
              className={cn(
                "flex flex-col max-w-[80%] transition-opacity",
                isMe ? "ml-auto items-end" : "mr-auto items-start",
                isOptimistic && "opacity-70"
              )}
            >
              <div
                className={cn(
                  "px-5 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm",
                  isMe
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-background text-foreground border border-border rounded-tl-none"
                )}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1.5 font-bold uppercase tracking-wider">
                {isOptimistic
                  ? "Enviando..."
                  : new Date(msg.createdAt).toLocaleTimeString("es-ES", { 
                      hour: "numeric", 
                      minute: "2-digit",
                      hour12: true 
                    })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Área de entrada */}
      <div className="p-4 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-border/50">
          <Button variant="ghost" size="icon" className="rounded-xl ml-1">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </Button>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] font-medium py-3 px-2 outline-none"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            size="icon"
            className="rounded-xl mr-1 h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

