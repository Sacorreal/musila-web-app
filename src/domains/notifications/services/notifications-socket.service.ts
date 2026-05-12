import { io, Socket } from "socket.io-client";
import { BASE_API_URL } from "@/src/shared/constants/env";
import { useNotificationsStore, Notification } from "../store/use-notifications-store";

class NotificationsSocketService {
  private socket: Socket | null = null;
  private currentToken: string | null = null;

  connect(token: string) {
    if (this.socket && this.socket.connected && this.currentToken !== token) {
      console.log("[NotificationsSocket] Token actualizado, reconectando...");
      this.disconnect();
    }

    if (!this.socket || !this.socket.connected) {
      if (!BASE_API_URL) {
        console.error("[NotificationsSocket] BASE_API_URL no está definida.");
        return null;
      }

      const baseUrl = BASE_API_URL.replace(/\/api\/v\d+\/?$/, "").replace(/\/$/, "") + "/notifications";

      console.log("[NotificationsSocket] Conectando a:", baseUrl);
      this.socket = io(baseUrl, {
        auth: { token: `Bearer ${token}` },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
      });
      this.currentToken = token;

      this.socket.on("connect", () => {
        console.log("[NotificationsSocket] Conectado exitosamente con ID:", this.socket?.id);
      });

      this.socket.on("notification.received", (notification: Notification) => {
        console.log("[NotificationsSocket] Notificación recibida:", notification);
        useNotificationsStore.getState().addNotification(notification);
      });

      this.socket.on("connect_error", (error) => {
        console.error("[NotificationsSocket] Error de conexión:", error.message);
      });

      this.socket.on("disconnect", (reason) => {
        console.warn("[NotificationsSocket] Desconectado:", reason);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentToken = null;
    }
  }
}

export const notificationsSocketService = new NotificationsSocketService();
