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
  musilaCreatorId: string;
}

/** Publisher coautora del split (participa sin firmar). */
export interface SplitOrganizationDto {
  id: string;
  name: string;
}

export interface SplitAuthorDto {
  id: string;
  /** Presente cuando el coautor es una persona; ausente si es una publisher. */
  user?: CoauthorSearchResult;
  /** Presente cuando el coautor es una publisher inyectada por defecto. */
  organization?: SplitOrganizationDto;
  percentage: number;
  role: CoauthorRole;
  status: SplitAuthorStatus;
  rejectionReason?: string;
  signedAt?: string;
}

export interface SplitResponse {
  id: string;
  status: SplitStatus;
  createdBy: { id: string; name: string; lastName: string };
  authors: SplitAuthorDto[];
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
