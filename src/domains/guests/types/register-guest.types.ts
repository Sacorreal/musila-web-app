// Tipos para el flujo de registro de invitados (guest)

export interface RegisterGuestInput {
  token: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  countryCode?: string;
  phone?: string;
  typeCitizenID?: string;
  citizenID?: string;
}

export interface InviteValidationResponse {
  id: string;
  token: string;
  email: string | null;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
  inviteUrl: string;
  qrCode: string;
}

export interface GuestRegisteredResponse {
  id: string;
  name: string;
  lastName: string;
  email: string;
  createdAt: string;
}
