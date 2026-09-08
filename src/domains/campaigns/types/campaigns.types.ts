export type CampaignVisibility = 'PUBLIC' | 'PRIVATE'

export type CampaignStatus = 'ACTIVE' | 'CLOSED'

export type CampaignClosedReason = 'DEADLINE' | 'QUOTA' | 'MANUAL'

export type CampaignSubmissionStatus = 'PENDING' | 'SELECTED' | 'DISCARDED' | 'LICENSED'

export interface CampaignGenreFilter {
  genreId: string
  genreName: string
  ritmos: string[] | null
}

export interface CampaignProgress {
  pendingCount: number
  selectedCount: number
  licensedCount: number
  discardedCount: number
  completionPercentage: number
}

export interface Campaign {
  id: string
  /** Nulo si es una campaña personal (sin organización). */
  organizationId: string | null
  createdByUserId: string
  title: string
  authorName: string
  description: string
  visibility: CampaignVisibility
  coverUrl: string | null
  displayCoverUrl: string | null
  genreFilters: CampaignGenreFilter[]
  songsPerComposerLimit: number
  requiredSongsCount: number
  deadline: string
  status: CampaignStatus
  closedReason: CampaignClosedReason | null
  closedAt: string | null
  privateToken?: string | null
  progress?: CampaignProgress
  createdAt: string
}

export interface CampaignSubmission {
  id: string
  campaignId: string
  trackId: string
  trackTitle: string
  trackCoverUrl: string | null
  trackAudioUrl: string | null
  composerId: string
  composerName: string
  status: CampaignSubmissionStatus
  requestedTrackId: string | null
  createdAt: string
}

export interface MatchingTrack {
  id: string
  title: string
  coverUrl: string | null
  audioUrl: string | null
  genre: string
  ritmo: string | null
  alreadySubmitted: boolean
}

export interface CampaignGenreFilterInput {
  genreId: string
  ritmos?: string[]
}

export interface CreateCampaignInput {
  title: string
  authorName?: string
  visibility?: CampaignVisibility
  coverUrl?: string
  genres: CampaignGenreFilterInput[]
  songsPerComposerLimit: number
  requiredSongsCount: number
  deadline: string
}

export interface PaginatedCampaigns {
  data: Campaign[]
  total: number
}
