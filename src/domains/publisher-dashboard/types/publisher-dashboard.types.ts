// Tipos espejo de los DTOs del backend (publisher-dashboard).

export interface PublisherOverview {
  songsPublished: number
  songsActive: number
  incomeGenerated: number
  currency: string
  totalPlays: number
  addedToPlaylists: number
  licenseRequestsReceived: number
  licensesSold: number
}

export interface PublisherSongDashboard {
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

export interface ComposerIncome {
  userId: string
  name: string
  income: number
}

export interface ComposerHighlight {
  name: string
  multiple: number
}

export interface PublisherRightsIntelligence {
  catalogUtilizationPct: number
  approvalRate: number
  requestsReceived: number
  topRequestedTracks: RankedItem[]
  topGenres: RankedItem[]
  topRhythms: RankedItem[]
  topComposers: ComposerIncome[]
  composerHighlight: ComposerHighlight | null
}

export interface PublisherRightsCompliance {
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

export interface PublisherFinancial {
  availableBalance: number
  pendingBalance: number
  totalEarned: number
  totalWithdrawn: number
  currency: string
  nextPayment: NextPayment | null
}
