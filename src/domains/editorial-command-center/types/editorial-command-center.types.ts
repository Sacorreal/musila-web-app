export interface HealthScoreField {
  key: string
  label: string
  completed: boolean
}

export interface HealthScoreCategory {
  score: number
  fields: HealthScoreField[]
  missingFields: string[]
  warning?: string
}

export interface SplitAuthoralScore {
  score: number
  signedCount: number
  totalCoauthors: number
}

export interface SplitEditorialScore {
  applicable: boolean
  score: number | null
  missingFields: string[]
}

export interface HealthScoreIntellectualProperty {
  score: number
  splitAuthoral: SplitAuthoralScore
  splitEditorial: SplitEditorialScore
}

export interface TrackHealthScore {
  trackId: string
  title: string
  overallScore: number
  documentary: HealthScoreCategory
  legal: HealthScoreCategory
  intellectualProperty: HealthScoreIntellectualProperty
  commercial: HealthScoreCategory
}

export interface CatalogHealthScoreItem {
  trackId: string
  title: string
  overallScore: number
  documentaryScore: number
  legalScore: number
  intellectualPropertyScore: number
  commercialScore: number
}

export interface HealthScoreCategoryAverages {
  documentary: number
  legal: number
  intellectualProperty: number
  commercial: number
}

export interface CatalogHealthScore {
  globalScore: number
  totalTracks: number
  categoryAverages: HealthScoreCategoryAverages
  tracks: CatalogHealthScoreItem[]
}
