"use client";

import axios from "axios";

// 1. Instancia global
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ Se aplica automáticamente a todas las peticiones
  timeout: 15000, // ⏱️ Buena práctica: Abortar peticiones colgadas después de 15 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. Interceptores de Respuesta (Manejo global de errores)
apiClient.interceptors.response.use(
  (response) => response, // Si todo va bien, devolvemos la respuesta intacta
  (error) => {
    // Si el backend devuelve un 401 (No autorizado)
    if (error.response?.status === 401) {
      console.warn("Sesión expirada o token inválido.");
      
      // Aquí podrías disparar una redirección al login
      window.location.href = "/login";
      
      // O si usas Zustand, podrías llamar a una función para limpiar el estado
      // useAuthStore.getState().logout();
    }

    // Errores de red (el backend está caído)
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error("Error de conexión con el servidor.");
    }

    return Promise.reject(error);
  }
);
