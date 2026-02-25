import axios, { AxiosProgressEvent } from "axios"
import type { CreateTrackFormValues } from "../validations/track.schema"
import { apiURLs } from "@/src/shared/constants/urls"

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

  // Campos simples
  Object.entries(dto).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })

  // Arrays
  authorsIds.forEach((id) => {
    formData.append("authorsIds", id)
  })

  // Files
  formData.append("audio", audio)

  if (coverImage) {
    formData.append("coverImage", coverImage)
  }

  const response = await axios.post(apiURLs.tracks.all, formData, {
    signal,
    withCredentials: true,
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