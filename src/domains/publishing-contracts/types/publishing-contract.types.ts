export enum PublishingContractStatus {
  VIGENTE = 'vigente',
  FINALIZADO = 'finalizado',
}

export interface PublishingContractDto {
  id: string
  publisherName: string
  startDate: string
  endDate: string | null
  documentKey: string
  documentUrl: string
  status: PublishingContractStatus
  createdAt: string
  updatedAt: string
}

export interface CreatePublishingContractInput {
  publisherName: string
  startDate: string
  endDate?: string
  documentKey: string
  documentUrl: string
}

export type UpdatePublishingContractInput = Partial<CreatePublishingContractInput>
