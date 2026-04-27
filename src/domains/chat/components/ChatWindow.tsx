"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useChatMessages } from "../hooks/use-chat.hooks";
import { useQueryClient } from "@tanstack/react-query";
import { chatSocketService } from "../services/chat-socket.service";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { requestPresignedUrls, uploadFileToSpaces } from "@/src/domains/storage/services/storage.client";
import {
  Send,
  Music2,
  MoreVertical,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  FileAudio,
  Loader2,
  Download,
} from "lucide-react";
import { cn } from "@/src/shared/libs/cn";
import { Button } from "@/src/shared/components/UI/button";
import { toast } from "sonner";
import type { MessageType } from "../types/chat.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ACCEPTED_FILES = "image/png,image/jpeg,image/gif,image/webp,application/pdf,audio/mpeg,audio/wav,audio/ogg,audio/mp4";
const MAX_FILE_SIZE_MB = 25;

function resolveMessageType(mimeType: string): MessageType {
  if (mimeType.startsWith("image/")) return "IMAGE";
  return "FILE";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(mimeType?: string) {
  if (!mimeType) return FileText;
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType.startsWith("audio/")) return FileAudio;
  return FileText;
}

// ─── Component ───────────────────────────────────────────────────────────────

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

  // 📎 Estado de archivo adjunto
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpiar mensajes en vivo al cambiar de conversación
  useEffect(() => {
    setLiveMessages([]);
    setInputValue("");
    setPendingFile(null);
    setUploadProgress(0);
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
    const socket = chatSocketService.connect(token);

    if (socket) {
      chatSocketService.joinChat(chatId);

      const handleNewMessage = (payload: any) => {
        if (payload.chatId === chatId) {
          setLiveMessages((prev) => {
            if (prev.some((m) => m.id === payload.messageId)) return prev;

            const isFromMe = payload.senderId === currentUserId;
            const filtered = isFromMe
              ? prev.filter(
                  (m) =>
                    !m.id.startsWith("optimistic-") ||
                    m.content.trim() !== payload.content.trim()
                )
              : prev;

            return [
              ...filtered,
              {
                id: payload.messageId,
                content: payload.content,
                sender: { id: payload.senderId },
                type: payload.type || "TEXT",
                fileUrl: payload.fileUrl,
                fileKey: payload.fileKey,
                fileName: payload.fileName,
                createdAt: new Date().toISOString(),
              },
            ];
          });

          queryClient.invalidateQueries({ queryKey: ["chat", chatId, "messages"] });
        }
      };

      socket.on("chat.message.sent", handleNewMessage);

      return () => {
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

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`El archivo supera el límite de ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setPendingFile(file);
    // Reset input para permitir re-selección del mismo archivo
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if (isUploading) return;
    if (!user) return;

    // Enviar archivo adjunto
    if (pendingFile) {
      await handleSendWithFile();
      return;
    }

    // Enviar solo texto
    if (!inputValue.trim()) return;

    const content = inputValue.trim();

    // Actualización optimista
    setLiveMessages((prev) => [
      ...prev,
      {
        id: `optimistic-${Date.now()}`,
        content,
        sender: { id: user.id },
        type: "TEXT",
        createdAt: new Date().toISOString(),
      },
    ]);
    setInputValue("");

    chatSocketService.sendMessage({
      chatId,
      userId: user.id,
      content,
      type: "TEXT",
    });

    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId, "messages"] });
    }, 1500);
  };

  const handleSendWithFile = async () => {
    if (!pendingFile || !user) return;

    const msgType = resolveMessageType(pendingFile.type);
    const content = inputValue.trim() || pendingFile.name;

    setIsUploading(true);
    setUploadProgress(0);

    // Mensaje optimista con indicador de carga
    const optimisticId = `optimistic-${Date.now()}`;
    setLiveMessages((prev) => [
      ...prev,
      {
        id: optimisticId,
        content,
        sender: { id: user.id },
        type: msgType,
        fileName: pendingFile.name,
        isUploading: true,
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      // 1. Solicitar presigned URL
      const folder = `chat/${chatId}/documents`;
      const { urls } = await requestPresignedUrls([
        { field: "chatFile", folder, file: pendingFile },
      ]);

      const presigned = urls[0];
      if (!presigned?.uploadUrl) throw new Error("No se recibió URL de subida");

      // 2. Subir al storage
      await uploadFileToSpaces(presigned.uploadUrl, pendingFile, (progress) => {
        setUploadProgress(progress);
      });

      // 3. Enviar mensaje por socket con la URL del archivo
      chatSocketService.sendMessage({
        chatId,
        userId: user.id,
        content,
        type: msgType,
        fileUrl: presigned.publicUrl,
        filekey: presigned.key,
        fileName: pendingFile.name,
        fileSize: pendingFile.size,
        mimeType: pendingFile.type,
      });

      // Limpiar estado
      setPendingFile(null);
      setInputValue("");

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["chat", chatId, "messages"] });
      }, 1500);
    } catch (error) {
      toast.error("Error al subir el archivo. Intenta de nuevo.");
      console.error("[ChatWindow] Error uploading file:", error);
      // Remover mensaje optimista fallido
      setLiveMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ─── Renderizado de mensajes ────────────────────────────────────────────────

  const renderMessageContent = (msg: any) => {
    const isMe = msg.sender?.id === user?.id;

    // Mensaje con archivo subiendo
    if (msg.isUploading) {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs opacity-70">
            <Loader2 size={14} className="animate-spin" />
            <span>Subiendo {msg.fileName}...</span>
          </div>
          {uploadProgress > 0 && (
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      );
    }

    // Mensaje con imagen
    if (msg.type === "IMAGE" && msg.fileUrl) {
      return (
        <div className="flex flex-col gap-2">
          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={msg.fileUrl}
              alt={msg.fileName || "Imagen"}
              className="max-w-[280px] max-h-[200px] rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          </a>
          {msg.content && msg.content !== msg.fileName && (
            <span className="text-[14px] leading-relaxed">{msg.content}</span>
          )}
        </div>
      );
    }

    // Mensaje con archivo (documento, audio)
    if (msg.type === "FILE" && msg.fileUrl) {
      const FileIcon = getFileIcon(msg.mimeType);
      return (
        <div className="flex flex-col gap-2">
          <a
            href={msg.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
              isMe
                ? "bg-white/10 hover:bg-white/20"
                : "bg-muted/50 hover:bg-muted"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
              isMe ? "bg-white/20" : "bg-primary/10"
            )}>
              <FileIcon size={18} className={isMe ? "text-white" : "text-primary"} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold truncate">{msg.fileName || "Archivo"}</span>
              {msg.fileSize && (
                <span className="text-[10px] opacity-60">{formatFileSize(msg.fileSize)}</span>
              )}
            </div>
            <Download size={16} className="shrink-0 opacity-60" />
          </a>
          {msg.content && msg.content !== msg.fileName && (
            <span className="text-[14px] leading-relaxed">{msg.content}</span>
          )}
        </div>
      );
    }

    // Mensaje de texto normal
    return <span>{msg.content}</span>;
  };

  // ─── Loading ────────────────────────────────────────────────────────────────

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

  // ─── Render ─────────────────────────────────────────────────────────────────

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
                {renderMessageContent(msg)}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1.5 font-bold uppercase tracking-wider">
                {isOptimistic
                  ? msg.isUploading
                    ? "Subiendo..."
                    : "Enviando..."
                  : new Date(msg.createdAt).toLocaleTimeString("es-ES", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Preview de archivo seleccionado */}
      {pendingFile && (
        <div className="px-4 pt-3 bg-background border-t border-border">
          <div className="max-w-4xl mx-auto flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-xl">
            {/* Thumbnail o icono */}
            {pendingFile.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(pendingFile)}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {React.createElement(getFileIcon(pendingFile.type), {
                  size: 20,
                  className: "text-primary",
                })}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-foreground truncate">
                {pendingFile.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {formatFileSize(pendingFile.size)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg"
              onClick={() => setPendingFile(null)}
              disabled={isUploading}
            >
              <X size={18} />
            </Button>
          </div>

          {/* Barra de progreso de subida */}
          {isUploading && uploadProgress > 0 && (
            <div className="max-w-4xl mx-auto mt-2">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Área de entrada */}
      <div className="p-4 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-border/50">
          {/* Input de archivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={ACCEPTED_FILES}
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl ml-1 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Paperclip className={cn("w-5 h-5", pendingFile ? "text-primary" : "text-muted-foreground")} />
          </Button>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={pendingFile ? "Agrega un mensaje (opcional)..." : "Escribe un mensaje..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] font-medium py-3 px-2 outline-none"
            disabled={isUploading}
          />
          <Button
            onClick={handleSend}
            disabled={(!inputValue.trim() && !pendingFile) || isUploading}
            size="icon"
            className="rounded-xl mr-1 h-10 w-10"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
