'use server'

import { getServerApiClient } from '@/src/shared/libs/axios/axios-server'
import { apiURLs } from '@/src/shared/constants/urls'
import type {
  PromotionStatus,
  PromotionType,
  PromotionView,
} from '@/src/domains/promotions/types/promotions.types'

/** Listado administrativo de pautas con filtros opcionales por estado/tipo. */
export async function fetchAdminPromotions(filters?: {
  status?: PromotionStatus
  type?: PromotionType
}): Promise<PromotionView[]> {
  const client = await getServerApiClient()
  const { data } = await client.get<PromotionView[]>(apiURLs.promotionsAdmin.base, {
    params: {
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.type ? { type: filters.type } : {}),
    },
  })
  return data
}
