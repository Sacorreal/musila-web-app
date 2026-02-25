'use server'

import axios, { AxiosProgressEvent } from "axios"
import { getServerApiClient } from "@/src/shared/libs/axios"
import type { CreateTrackFormValues } from "../validations/track.schema"

interface CreateTrackOptions {
  onProgress?: (percentage: number) => void
  signal?: AbortSignal
}

export async function createTrackRequest(
  data: CreateTrackFormValues,
  options?: CreateTrackOptions,
) {
  const { onProgress, signal } = options || {}

  const formData = new FormData()

  const { audio, coverImage, authorsIds, ...dto } = data

  // 🔹 Campos simples
  Object.entries(dto).forEach(([key, value]) => {
    formData.append(key, String(value))
  })

  // 🔹 Arrays
  authorsIds.forEach((id) => {
    formData.append("authorsIds", id)
  })

  // 🔹 Files
  formData.append("audio", audio)

  if (coverImage) {
    formData.append("coverImage", coverImage)
  }
  const apiClient = await getServerApiClient()

  const response = await apiClient.post("/tracks", formData, {
    signal,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (!progressEvent.total) return

      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      )

      onProgress?.(percent)
    },
  })

  return response.data
}