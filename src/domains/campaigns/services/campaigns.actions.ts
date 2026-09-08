'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type { Campaign } from '../types/campaigns.types'

export async function fetchCampaignByIdAction(id: string): Promise<Campaign | null> {
  try {
    const client = await getServerApiClient()
    const { data } = await client.get<Campaign>(apiURLs.campaigns.byId(id))
    return data
  } catch (error) {
    console.error(`Error en fetchCampaignByIdAction para id ${id}:`, error)
    return null
  }
}

export async function fetchCampaignByTokenAction(token: string): Promise<Campaign | null> {
  try {
    const client = await getServerApiClient()
    const { data } = await client.get<Campaign>(apiURLs.campaigns.byToken(token))
    return data
  } catch (error) {
    console.error(`Error en fetchCampaignByTokenAction para token ${token}:`, error)
    return null
  }
}
