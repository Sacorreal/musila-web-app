// Tipos para el dominio de invitaciones

export interface CreateInviteInput {
  email: string;
  guestName: string;
}

export interface InviteResponse {
  id: string;
  token: string;
  email: string | null;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
  inviteUrl: string;
  qrCode: string; // Data URI base64 del QR
}
