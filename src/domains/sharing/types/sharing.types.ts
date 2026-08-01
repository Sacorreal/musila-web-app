export enum ShareResourceType {
  PROFILE = "profile",
  PLAYLIST = "playlist",
  TRACK = "track",
}

export enum ShareAccessReason {
  GRANTED = "granted",
  OWNER_ACCESS = "owner_access",
  NOT_AUTHENTICATED = "not_authenticated",
  NOT_AUTHORIZED = "not_authorized",
  EXPIRED = "expired",
  REVOKED = "revoked",
  TOKEN_NOT_FOUND = "token_not_found",
}

export interface ShareLinkResponse {
  id: string;
  token: string;
  resourceType: ShareResourceType;
  resourceId: string;
  shareUrl: string;
  expiresAt?: string | null;
  revokedAt?: string | null;
  viewCount: number;
  createdAt: string;
}

export interface AuthorizedRecipient {
  id: string;
  recipientUserId: string;
  recipientName: string;
  recipientMusilaCreatorId: string;
  revokedAt?: string | null;
  createdAt: string;
}

export interface ValidateAccessResponse {
  granted: boolean;
  reason: ShareAccessReason;
  resourceType?: ShareResourceType;
  resourceId?: string;
}

export interface ShareAccessLogEntry {
  id: string;
  token: string;
  resourceType?: ShareResourceType | null;
  resourceId?: string | null;
  accessorUserId?: string | null;
  accessorMusilaCreatorId?: string | null;
  granted: boolean;
  reason: ShareAccessReason;
  createdAt: string;
}

export interface PaginatedShareAccessLog {
  data: ShareAccessLogEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface CoauthorSearchResult {
  id: string;
  name: string;
  lastName: string;
  musilaCreatorId: string;
}
