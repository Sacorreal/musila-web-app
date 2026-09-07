export type PromotionType = 'TRACK' | 'COMPOSER'

export type PromotionStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'FINISHED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'EXPIRED'

export type PromotionPaymentStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'DECLINED'

export interface Promotion {
  id: string
  type: PromotionType
  targetId: string
  organizationId: string
  requestedByUserId: string
  status: PromotionStatus
  priceAmount: number
  currency: string
  paymentStatus: PromotionPaymentStatus
  paymentReference?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  approvedAt?: string | null
  rejectionReason?: string | null
  createdAt: string
  updatedAt: string
}

export interface PromotionView extends Promotion {
  resource: { title: string; imageUrl?: string | null; subtitle?: string | null } | null
  requester: { id: string; name: string; email: string } | null
}

export interface PromotableComposer {
  id: string
  name: string
  avatarUrl: string | null
  genre: string | null
  alreadyPromoted: boolean
}

export interface PromotableTrack {
  id: string
  title: string
  coverUrl: string | null
  author: string | null
  genre: string | null
  alreadyPromoted: boolean
}

export interface PromotableResources {
  composers: PromotableComposer[]
  tracks: PromotableTrack[]
}

export interface PromotionPricingItem {
  id: string
  type: PromotionType
  amount: number
  currency: string
  effectiveFrom: string
  effectiveUntil: string | null
  isActive: boolean
  createdByName?: string | null
  createdAt: string
}

export interface SchedulePreview {
  startsAt: string
  expiresAt: string
  hasCupo: boolean
}

export interface CreatePromotionResponse {
  promotion: Promotion
  preview: SchedulePreview
  price: number
  currency: string
}

export interface PromotionWidget {
  publicKey: string
  currency: string
  amountInCents: number
  reference: string
  signature: string
  redirectUrl: string
}

export interface PromotionCheckoutResponse {
  widget: PromotionWidget
  externalReference: string
  total: number
}

/** Track destacado público (componente “Tracks Destacados”). */
export interface FeaturedTrack {
  promotionId: string
  trackId: string
  title: string
  coverUrl: string | null
  author: string | null
  genre: string | null
}

/** Compositor destacado público (componente “Compositores Destacados”). */
export interface FeaturedComposer {
  promotionId: string
  composerId: string
  name: string
  avatarUrl: string | null
  genre: string | null
}
