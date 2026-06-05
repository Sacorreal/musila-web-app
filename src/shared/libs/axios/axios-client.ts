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

// 2. Interceptor de Petición (Inyectar Token)
apiClient.interceptors.request.use(
  (config) => {
    // Obtenemos el token directamente del estado global de Zustand
    // Lo importamos dinámicamente para evitar problemas de dependencias cíclicas y que funcione bien con SSR/CSR
    const { useAuthStore } = require("@/src/domains/auth/store/use-auth-store");
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptores de Respuesta (Manejo global de errores)
apiClient.interceptors.response.use(
  (response) => response, // Si todo va bien, devolvemos la respuesta intacta
  (error) => {
    // Verificamos si la petición fue a nuestro propio backend (no a URLs externas como DO Spaces)
    const requestUrl = error.config?.url || "";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const isInternalRequest =
      requestUrl.startsWith("/") || // Rutas relativas (usan baseURL)
      (baseUrl && requestUrl.startsWith(baseUrl)); // URL absoluta de nuestro backend

    // HTTP 402 — límite de plan alcanzado
    if (error.response?.status === 402 && isInternalRequest) {
      const data = error.response?.data ?? {};
      if (data.error === 'PLAN_LIMIT_REACHED' && typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('plan:limit-reached', {
            detail: { resource: data.resource, limit: data.limit },
          }),
        );
      }
    }

    // Solo manejamos 401 para peticiones a NUESTRO backend
    if (error.response?.status === 401 && isInternalRequest) {
      console.warn("Sesión expirada o token inválido.");

      // Limpiamos la sesión de Zustand sin hacer un hard redirect
      // Esto permite que el componente maneje el error con un toast y no pierda el contexto
      const { useAuthStore } = require("@/src/domains/auth/store/use-auth-store");
      useAuthStore.getState().clearSession();

      // Emitimos un evento personalizado para que la UI pueda reaccionar (ej. mostrar un modal)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
      }
    }

    // Errores de red (el backend está caído)
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error("Error de conexión con el servidor.");
    }

    return Promise.reject(error);
  }
);
