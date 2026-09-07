/** Tipos de organización compradora a los que aplica la comisión B2B (§3). */
export type BuyerOrganizationType = 'LABEL' | 'MANAGEMENT'

/** Fila vigente de comisión por (plan, tipo de organización) (§6). */
export interface TransactionFeeView {
  planId: string
  planKey: string
  planName: string
  organizationType: BuyerOrganizationType
  rate: number | null
  currency: string | null
  effectiveFrom: string | null
  updatedBy: string | null
  entitlementKey: string
}

/** Entrada del historial de vigencia de una tarifa (§21). */
export interface TransactionFeeHistoryEntry {
  id: string
  organizationType: BuyerOrganizationType
  rate: number
  currency: string
  effectiveFrom: string
  effectiveUntil: string | null
  isActive: boolean
  changedByUserId: string | null
  changedByName: string | null
  createdAt: string
}

export interface UpdateTransactionFeeInput {
  organizationType: BuyerOrganizationType
  rate: number
}
