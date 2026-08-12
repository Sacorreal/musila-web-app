// Tipos espejo de los DTOs del backend (author-dashboard).

export interface AuthorOverview {
  songsPublished: number
  songsActive: number
  incomeGenerated: number
  currency: string
  totalPlays: number
  addedToPlaylists: number
  licenseRequestsReceived: number
  licensesSold: number
}

export interface SongDashboard {
  trackId: string
  title: string
  plays: number
  uniqueListeners: number
  playlists: number
}

export interface RankedItem {
  label: string
  count: number
}

export interface RightsIntelligence {
  catalogUtilizationPct: number
  approvalRate: number
  requestsReceived: number
  topRequestedTracks: RankedItem[]
  topGenres: RankedItem[]
  topRhythms: RankedItem[]
}

export interface RightsCompliance {
  activeWorks: number
  inactiveWorks: number
  licensedWorks: number
  worksWithoutSplit: number
  worksWithoutRegistration: number
  privateWorks: number
  visibleWorks: number
  avgNegotiationDays: number
  closeRate: number
  avgLicenseValue: number
  currency: string
}

export interface NextPayment {
  amount: number
  dueDate: string
  trackTitle: string
}

export interface AuthorFinancial {
  availableBalance: number
  pendingBalance: number
  totalEarned: number
  totalWithdrawn: number
  currency: string
  nextPayment: NextPayment | null
}
