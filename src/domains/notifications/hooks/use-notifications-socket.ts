import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { notificationsSocketService } from '../services/notifications-socket.service';
import { useNotificationsStore } from '../store/use-notifications-store';

export function useNotificationsSocket() {
  const token = useAuthStore((state) => state.token);

  // Usamos refs estables para no incluir las funciones del store en las dependencias del effect,
  // evitando un bucle de re-renders que dispara peticiones ECONNRESET al backend.
  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications);
  const fetchUnreadCount = useNotificationsStore((state) => state.fetchUnreadCount);

  const fetchNotificationsRef = useRef(fetchNotifications);
  const fetchUnreadCountRef = useRef(fetchUnreadCount);

  // Mantenemos las refs actualizadas sin relanzar el effect
  fetchNotificationsRef.current = fetchNotifications;
  fetchUnreadCountRef.current = fetchUnreadCount;

  useEffect(() => {
    if (token) {
      notificationsSocketService.connect(token);

      // Llamamos por las refs estables → el effect solo depende de `token`
      fetchNotificationsRef.current();
      fetchUnreadCountRef.current();
    } else {
      notificationsSocketService.disconnect();
    }

    // Solo el token determina cuándo reconectar/desconectar
  }, [token]);
}
