import { UserPlanType } from "../../users/types/user.types";

export interface GuestResponse {
  id: string;
  name: string;
  lastName: string;
  email: string;
  countryCode?: string;
  phone?: string;
  typeCitizenID?: string;
  citizenID?: string;
  avatar?: string;
  isVerified: boolean;
  planType: UserPlanType;
  createdAt: string;
  updatedAt: string;
  invited_by?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UpdateGuestInput {
  name?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  typeCitizenID?: string;
  citizenID?: string;
}

export interface PaginatedGuestsResponse {
  data: GuestResponse[];
  total: number;
}