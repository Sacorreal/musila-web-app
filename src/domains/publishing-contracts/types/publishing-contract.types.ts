export enum PublishingContractStatus {
  VIGENTE = 'vigente',
  FINALIZADO = 'finalizado',
}

export interface PublishingContractDto {
  id: string
  publisherName: string
  ipiNumber: string | null
  percentage: number | null
  startDate: string
  endDate: string | null
  documentKey: string | null
  documentUrl: string | null
  status: PublishingContractStatus
  createdAt: string
  updatedAt: string
}

export interface CreatePublishingContractInput {
  publisherName: string
  ipiNumber: string
  percentage: number
  startDate: string
  endDate?: string
  documentKey?: string
  documentUrl?: string
}

export type UpdatePublishingContractInput = Partial<CreatePublishingContractInput>
