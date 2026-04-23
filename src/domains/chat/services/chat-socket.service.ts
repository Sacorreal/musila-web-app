import { io, Socket } from "socket.io-client";
import { BASE_API_URL } from "@/src/shared/constants/env";

export interface SendMessagePayload {
  userId: string;
  chatId: string;
  content: string;
  type: "TEXT" | "FILE";
  fileUrl?: string;
  filekey?: string;
  fileName?: string;
}

class ChatSocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (!this.socket) {
      if (!BASE_API_URL) {
        console.error("[ChatSocket] BASE_API_URL no está definida. Verifica NEXT_PUBLIC_BASE_API_URL en tu .env.local");
        return null;
      }

      // Extraemos el host base eliminando el path de la API (/api/v1, etc.)
      // Ej: "http://localhost:3001/api/v1" → "http://localhost:3001/chat"
      const baseUrl = BASE_API_URL.replace(/\/api\/v\d+\/?$/, "").replace(/\/$/, "") + "/chat";

      this.socket = io(baseUrl, {
        auth: { token: `Bearer ${token}` },
        transports: ["websocket"],
      });

      this.socket.on("connect", () => {
        console.log("Connected to chat socket", this.socket?.id);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
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
    if (this.socket) {
      this.socket.emit("sendMessage", payload);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const chatSocketService = new ChatSocketService();
