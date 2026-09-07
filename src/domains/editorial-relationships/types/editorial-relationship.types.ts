export type EditorialRelationshipSource = 'SELF_DECLARED' | 'PUBLISHER_CONFIRMED'

export type EditorialRelationshipStatus = 'declarada' | 'confirmada' | 'rechazada' | 'activa_sin_confirmar'

export interface EditorialRelationshipDto {
  source: EditorialRelationshipSource
  status: EditorialRelationshipStatus
  editoraName: string
  editoraIpiNumber: string | null
  percentage: number | null
  documentUrl: string | null
  confirmedAt: string | null
  createdAt: string
  counterpartyName: string | null
}
