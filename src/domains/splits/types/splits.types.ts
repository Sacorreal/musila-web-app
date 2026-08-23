export enum CoauthorRole {
  COMPOSITOR = "compositor",
  AUTOR = "autor",
  COMPOSITOR_AUTOR = "compositor_autor",
  ADAPTADOR = "adaptador",
  ARREGLISTA = "arreglista",
  TRADUCTOR = "traductor",
}

export const COAUTHOR_ROLE_LABELS: Record<CoauthorRole, string> = {
  [CoauthorRole.COMPOSITOR]: "Compositor",
  [CoauthorRole.AUTOR]: "Autor",
  [CoauthorRole.COMPOSITOR_AUTOR]: "Compositor - Autor",
  [CoauthorRole.ADAPTADOR]: "Adaptador",
  [CoauthorRole.ARREGLISTA]: "Arreglista",
  [CoauthorRole.TRADUCTOR]: "Traductor",
};

export enum SplitStatus {
  PENDING_APPROVAL = "pending_approval",
  COMPLETED = "completed",
  BLOCKED = "blocked",
}

export enum SplitAuthorStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface CoauthorSearchResult {
  id: string;
  name: string;
  lastName: string;
  username: string;
}

export interface SplitAuthorDto {
  id: string;
  /** El coautor de un split siempre es una persona que firma su participación. */
  user?: CoauthorSearchResult;
  percentage: number;
  role: CoauthorRole;
  status: SplitAuthorStatus;
  rejectionReason?: string;
  signedAt?: string;
}

/**
 * Publisher's Share de una publisher aplicado al track: metadata informativa
 * (no es coautor y no participa del reparto).
 */
export interface SplitPublisherShareDto {
  organizationId: string;
  organizationName: string;
  percentage: number;
}

export interface SplitResponse {
  id: string;
  status: SplitStatus;
  createdBy: { id: string; name: string; lastName: string };
  authors: SplitAuthorDto[];
  /** Publisher's Share informativo resuelto para el creador (no persistido en el split). */
  publisherShares?: SplitPublisherShareDto[];
  createdAt: string;
  updatedAt: string;
}

export interface SplitAuthorInput {
  userId: string;
  percentage: number;
  role: CoauthorRole;
}

export interface CreateSplitInput {
  authors: SplitAuthorInput[];
}
