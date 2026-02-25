"use server"

import axios from "axios"
import { cookies } from "next/headers"
import { BASE_API_URL } from "../constants/env"

export async function getServerApiClient() {
  const apiClient = axios.create({
    baseURL: BASE_API_URL
  })
  apiClient.interceptors.request.use(async (config) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  return apiClient
}