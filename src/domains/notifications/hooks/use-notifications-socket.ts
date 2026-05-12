import { useEffect } from 'react';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { notificationsSocketService } from '../services/notifications-socket.service';
import { useNotificationsStore } from '../store/use-notifications-store';

export function useNotificationsSocket() {
  const token = useAuthStore((state) => state.token);
  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications);
  const fetchUnreadCount = useNotificationsStore((state) => state.fetchUnreadCount);

  useEffect(() => {
    if (token) {
      // Connect to websocket
      notificationsSocketService.connect(token);
      
      // Fetch initial state
      fetchNotifications();
      fetchUnreadCount();
    } else {
      notificationsSocketService.disconnect();
    }

    return () => {
      // We don't necessarily disconnect on unmount of a specific component
      // if we want notifications to keep working globally, 
      // but if the token changes or logs out, it will disconnect.
    };
  }, [token, fetchNotifications, fetchUnreadCount]);
}
