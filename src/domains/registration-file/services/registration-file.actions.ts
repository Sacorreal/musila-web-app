'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { RegistrationFileDto } from '../types/registration-file.types'

export async function fetchRegistrationFileByTrack(trackId: string): Promise<RegistrationFileDto | null> {
  const client = await getServerApiClient()
  try {
    const response = await client.get<RegistrationFileDto>(apiURLs.registrationFile.byTrack(trackId))
    return response.data
  } catch (error: any) {
    if (error?.response?.status === 404) return null
    throw error
  }
}
