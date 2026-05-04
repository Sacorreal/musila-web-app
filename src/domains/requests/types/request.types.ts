export enum RequestStatus {
  PENDIENTE = "pendiente",
  APROBADA = "aprobada",
  RECHAZADA = "rechazada",
  CANCELADA = "cancelada",
}

export interface TrackRequest {
  id: string;
  status: RequestStatus;
  licenseType: string;
  createdAt: string;
  trackId?: string;
  track?: {
    id: string;
    title: string;
    coverUrl?: string;
    audioUrl?: string;
  };
  requester?: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  documentUrl?: string;
  unreadCount?: number;
  chat?: {
    id: string;
  };
}
