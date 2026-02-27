"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { BASE_API_URL } from '@shared/constants/env';

export async function getServerApiClient() {
  // Extraemos la cookie de la petición entrante a Next.js
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // Creamos una instancia "limpia" y aislada para esta petición específica
  const serverClient = axios.create({
    baseURL: BASE_API_URL,
    timeout: 15000, // Evita que los Server Actions se queden colgados
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Si hay token, lo inyectamos de forma segura usando spread operator
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // Interceptor exclusivo para el entorno de servidor (logs limpios en consola)
  serverClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // Formateamos el error para que tu terminal de servidor no se inunde con basura ilegible
      const url = error.config?.url;
      const status = error.response?.status || 'SIN RESPUESTA';
      const message = error.response?.data?.message || error.message;

      console.error(`[Server API Error] 🚨 [${status}] ${url} - ${message}`);

      return Promise.reject(error);
    }
  );

  return serverClient;
}