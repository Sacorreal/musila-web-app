// Tipos espejo de los DTOs del backend (buyer-dashboard).

export interface BuyerRankedTrack {
  trackId: string
  title: string
  plays: number
}

export interface BuyerActiveMember {
  userId: string
  name: string
  plays: number
}

export interface BuyerMonthlyLicenseTrendPoint {
  month: string // 'YYYY-MM'
  count: number
}

export interface BuyerOverview {
  playsThisMonth: number
  playsLastMonth: number
  playsChangePct: number
  licensesThisMonth: number
  licensesLastMonth: number
  licensesChangePct: number
  licensedValueThisMonth: number
  currency: string // 'COP'
  activeRosterMembers: number
  topTrackThisMonth: BuyerRankedTrack | null
  mostActiveRosterMember: BuyerActiveMember | null
  monthlyLicenseTrend: BuyerMonthlyLicenseTrendPoint[] // 6 meses, orden cronológico ascendente
}

export interface BuyerLicensedTrackRow {
  requestId: string
  trackId: string
  trackTitle: string
  ownerName: string // autor/dueño de la canción
  requesterId: string
  requesterName: string // miembro del roster que solicitó la licencia
  licenseType: string
  licensePrice: number | null
  currency: string
  licensePaymentStatus: string
  approvedAt: string // ISO
  createdAt: string // ISO
}

export interface BuyerDashboardLicensesResponse {
  month: string // 'YYYY-MM'
  total: number
  data: BuyerLicensedTrackRow[]
}
