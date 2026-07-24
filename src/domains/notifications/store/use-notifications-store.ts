import { create } from 'zustand';
import { apiClient } from '@/src/shared/libs/axios/axios-client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

// AbortController externo para cancelar peticiones en vuelo si se llama de nuevo
let fetchNotificationsController: AbortController | null = null;
let isFetchingNotifications = false;
let isFetchingUnreadCount = false;

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    // Evitar llamadas simultáneas
    if (isFetchingNotifications) return;
    isFetchingNotifications = true;

    // Cancelar petición previa si aún está en vuelo
    if (fetchNotificationsController) {
      fetchNotificationsController.abort();
    }
    fetchNotificationsController = new AbortController();

    set({ isLoading: true });
    try {
      const response = await apiClient.get('/notifications?limit=20', {
        signal: fetchNotificationsController.signal,
      });
      set({ notifications: response.data, isLoading: false });
    } catch (error: any) {
      // Ignorar errores de cancelación (AbortError) — son esperados
      if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
        console.error('Error fetching notifications:', error);
      }
      set({ isLoading: false });
    } finally {
      isFetchingNotifications = false;
    }
  },

  fetchUnreadCount: async () => {
    // Evitar llamadas simultáneas
    if (isFetchingUnreadCount) return;
    isFetchingUnreadCount = true;

    try {
      const response = await apiClient.get('/notifications/unread-count');
      set({ unreadCount: response.data.count });
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      isFetchingUnreadCount = false;
    }
  },

  markAsRead: async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 20),
      unreadCount: state.unreadCount + 1,
    }));
  },
}));

