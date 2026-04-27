import { io, Socket } from "socket.io-client";
import { BASE_API_URL } from "@/src/shared/constants/env";
import type { MessageType } from "../types/chat.types";

export interface SendMessagePayload {
  userId: string;
  chatId: string;
  content: string;
  type: MessageType;
  fileUrl?: string;
  filekey?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

class ChatSocketService {
  private socket: Socket | null = null;
  private currentToken: string | null = null;

  connect(token: string) {
    // Si el socket existe pero el token es diferente, desconectar para usar el nuevo
    if (this.socket && this.socket.connected && this.currentToken !== token) {
      console.log("[ChatSocket] Token actualizado, reconectando...");
      this.disconnect();
    }

    if (!this.socket || !this.socket.connected) {
      if (!BASE_API_URL) {
        console.error("[ChatSocket] BASE_API_URL no está definida.");
        return null;
      }

      const baseUrl = BASE_API_URL.replace(/\/api\/v\d+\/?$/, "").replace(/\/$/, "") + "/chat";

      console.log("[ChatSocket] Conectando a:", baseUrl);
      this.socket = io(baseUrl, {
        auth: { token: `Bearer ${token}` },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
      });
      this.currentToken = token;

      this.socket.on("connect", () => {
        console.log("[ChatSocket] Conectado exitosamente con ID:", this.socket?.id);
      });

      this.socket.on("connect_error", (error) => {
        console.error("[ChatSocket] Error de conexión:", error.message);
      });

      this.socket.on("disconnect", (reason) => {
        console.warn("[ChatSocket] Desconectado:", reason);
      });
    }
    return this.socket;
  }

  joinChat(chatId: string) {
    if (this.socket) {
      this.socket.emit("joinChat", { chatId });
    }
  }

  sendMessage(payload: SendMessagePayload) {
    if (this.socket && this.socket.connected) {
      console.log("[ChatSocket] Emitiendo 'sendMessage':", payload);
      this.socket.emit("sendMessage", payload);
    } else {
      console.warn("[ChatSocket] No se pudo enviar mensaje. Socket existe:", !!this.socket, "Conectado:", this.socket?.connected);
      // Reintentar conexión si no hay socket
      if (!this.socket) {
        console.log("[ChatSocket] Intentando reconectar...");
      }
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentToken = null;
    }
  }
}

export const chatSocketService = new ChatSocketService();
